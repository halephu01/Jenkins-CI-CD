package com.nhom6.microservices.product_service.dto;

import java.math.BigDecimal;
import java.util.List;


public record ProductRequest(String id, String name, String description,
                             String skuCode, BigDecimal price, String type, List<String> imageUrl) { }