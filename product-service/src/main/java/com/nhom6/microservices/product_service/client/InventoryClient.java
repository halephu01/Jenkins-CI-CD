package com.nhom6.microservices.product_service.client;

import com.nhom6.microservices.product_service.dto.InventoryRequest;
import com.nhom6.microservices.product_service.dto.InventoryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;

public interface InventoryClient {
    Logger log = LoggerFactory.getLogger(InventoryClient.class);

    @PostExchange("/api/inventorys")
    InventoryResponse createInventory(@RequestBody InventoryRequest inventoryRequest);

    default InventoryResponse fallbackCreateMethod(InventoryRequest request, Throwable throwable) {
        log.error("Cannot create inventory for skucode {}, failure reason: {}",
                request.getSkuCode(), throwable.getMessage());
        return null;
    }
}