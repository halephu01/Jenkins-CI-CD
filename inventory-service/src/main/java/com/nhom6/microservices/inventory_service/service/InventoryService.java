package com.nhom6.microservices.inventory_service.service;

import com.nhom6.microservices.inventory_service.dto.ApiResponse;
import com.nhom6.microservices.inventory_service.dto.InventoryRequest;
import com.nhom6.microservices.inventory_service.dto.InventoryResponse;
import com.nhom6.microservices.inventory_service.exception.AppException;
import com.nhom6.microservices.inventory_service.exception.ErrorCode;
import com.nhom6.microservices.inventory_service.model.Inventory;
import com.nhom6.microservices.inventory_service.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public boolean isInStock(String skuCode, Integer quantity) {
        return inventoryRepository.existsBySkuCodeAndQuantityIsGreaterThanEqual(skuCode, quantity);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public InventoryResponse createInventory(InventoryRequest inventoryRequest) {
        Inventory inventory = new Inventory();
        inventory.setSkuCode(inventoryRequest.getSkuCode());
        inventory.setQuantity(inventoryRequest.getQuantity());
        inventoryRepository.save(inventory);
        return new InventoryResponse(inventory.getSkuCode(), inventory.getQuantity());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll()
                .stream()
                .map(inventory -> new InventoryResponse(inventory.getSkuCode(), inventory.getQuantity()))
                .toList();
    }

    @PreAuthorize(("hasRole('ADMIN')"))
    public InventoryResponse getInventory(String skuCode) {
        Inventory inventory = inventoryRepository.findBySkuCode(skuCode)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return InventoryResponse.builder()
                .skuCode(inventory.getSkuCode())
                .quantity(inventory.getQuantity())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public InventoryResponse updateInventory(InventoryRequest inventoryRequest) {
        Inventory inventory = inventoryRepository.findBySkuCode(inventoryRequest.getSkuCode())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        inventory.setQuantity(inventoryRequest.getQuantity());
        inventoryRepository.save(inventory);
        return new InventoryResponse(inventory.getSkuCode(), inventory.getQuantity());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public String deleteInventory(String skuCode) {
        Inventory inventory = inventoryRepository.findBySkuCode(skuCode)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        inventoryRepository.delete(inventory);
        return "Inventory deleted";
    }


    public boolean deductQuantity(String skuCode, Integer quantity) {
        Inventory inventory = inventoryRepository.findBySkuCode(skuCode)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        if (inventory.getQuantity() < quantity) {
            return false;
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);
        return true;
    }
}

