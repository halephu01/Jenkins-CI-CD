package com.nhom6.microservices.order.service;

import com.nhom6.microservices.order.client.InventoryClient;
import com.nhom6.microservices.order.dto.OrderRequest;
import com.nhom6.microservices.order.dto.OrderResponse;
import com.nhom6.microservices.order.event.OrderPlacedEvent;
import com.nhom6.microservices.order.exception.AppException;
import com.nhom6.microservices.order.exception.ErrorCode;
import com.nhom6.microservices.order.model.Order;
import com.nhom6.microservices.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    @Autowired
    private  OrderRepository orderRepository;
    @Autowired
    private  InventoryClient inventoryClient;
    @Autowired
    private  KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public void placeOrder(OrderRequest orderRequest) {
        // Kiểm tra tồn kho
        var isProductInStock = inventoryClient.isInStock(orderRequest.skuCode(), orderRequest.quantity());

        if (isProductInStock) {
            // Thực hiện giảm số lượng trong kho
            boolean deductResult = inventoryClient.deductQuantity(orderRequest.skuCode(), orderRequest.quantity());
            if (!deductResult) {
                throw new AppException(ErrorCode.INVENTORY_DEDUCTION_FAILED);
            }

            Order order = new Order();
            order.setOrderNumber(UUID.randomUUID().toString());
            order.setPrice(orderRequest.price());
            order.setSkuCode(orderRequest.skuCode());
            order.setQuantity(orderRequest.quantity());
            order.setOrderDate(orderRequest.orderDate());
            orderRepository.save(order);

            OrderPlacedEvent orderPlacedEvent = OrderPlacedEvent.newBuilder()
                    .setOrderNumber(order.getOrderNumber())
                    .setEmail(orderRequest.userDetails().email())
                    .setFirstName(orderRequest.userDetails().firstName())
                    .setLastName(orderRequest.userDetails().lastName())
                    .build();

            log.info("OrderPlacedEvent before sending to Kafka: {}", orderPlacedEvent);

            if (orderPlacedEvent.getOrderNumber() == null || orderPlacedEvent.getEmail() == null
                    || orderPlacedEvent.getFirstName() == null || orderPlacedEvent.getLastName() == null) {
                throw new IllegalArgumentException("OrderPlacedEvent has null fields");
            }

            kafkaTemplate.send("order-placed", orderPlacedEvent);
        } else {
            throw new AppException(ErrorCode.INSUFFICIENT_INVENTORY);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> getAllOrders() {
            return orderRepository.findAll().stream()
                    .map(order -> new OrderResponse(order.getId(),order.getOrderNumber(),
                            order.getSkuCode(), order.getPrice(), order.getQuantity(),order.getOrderDate())).toList();
    }

    public OrderResponse getOrder(String orderNumber) {
        var order = orderRepository.findByOrderNumber(orderNumber);
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .skuCode(order.getSkuCode())
                .price(order.getPrice())
                .quantity(order.getQuantity())
                .orderDate(order.getOrderDate())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateOrder(String orderNumber, OrderRequest orderRequest) {
        var order = orderRepository.findByOrderNumber(orderNumber);
        order.setPrice(orderRequest.price());
        order.setQuantity(orderRequest.quantity());
        order.setOrderDate(orderRequest.orderDate());
        orderRepository.save(order);
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .skuCode(order.getSkuCode())
                .price(order.getPrice())
                .quantity(order.getQuantity())
                .orderDate(order.getOrderDate())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public String deleteOrder(String orderNumber) {
        var order = orderRepository.findByOrderNumber(orderNumber);
        orderRepository.delete(order);
        return order.getOrderNumber();
    }


}
