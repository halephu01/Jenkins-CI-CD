package com.nhom6.microservices.order.dto;

import java.math.BigDecimal;
import java.util.Date;

public record  OrderRequest(Long id, String orderNumber, String skuCode,
                            BigDecimal price, Integer quantity, Date orderDate, UserDetails userDetails) {
    public record UserDetails(String email, String firstName, String lastName) {}
}
