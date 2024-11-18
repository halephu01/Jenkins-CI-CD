package com.nhom6.microservices.inventory_service.controller;

import com.nhom6.microservices.inventory_service.dto.InventoryRequest;
import com.nhom6.microservices.inventory_service.dto.InventoryResponse;
import com.nhom6.microservices.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventorys")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;
    @GetMapping("/instock")
    @ResponseStatus(HttpStatus.OK)
    public boolean isInStock(@RequestParam String skuCode, @RequestParam Integer quantity){
        return inventoryService.isInStock(skuCode,quantity);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> getAllInventory(){
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{skuCode}")
    @ResponseStatus(HttpStatus.OK)
    public InventoryResponse getInventory(@PathVariable String skuCode){
        return inventoryService.getInventory(skuCode);
    }

    @PutMapping("/{skuCode}")
    @ResponseStatus(HttpStatus.OK)
    public InventoryResponse updateInventory(@RequestBody InventoryRequest inventoryRequest){
        return inventoryService.updateInventory(inventoryRequest);
    }

    @DeleteMapping("/{skuCode}")
    public void deleteInventory(@PathVariable String skuCode){
        inventoryService.deleteInventory(skuCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryResponse createInventory(@RequestBody InventoryRequest inventoryRequest){
        return inventoryService.createInventory(inventoryRequest);
    }

    @PostMapping("/deduct")
    @ResponseStatus(HttpStatus.OK)
    public boolean deductQuantity(@RequestParam String skuCode, @RequestParam Integer quantity) {
        return inventoryService.deductQuantity(skuCode, quantity);
    }
}
