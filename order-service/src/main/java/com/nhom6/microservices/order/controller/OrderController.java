package com.nhom6.microservices.order.controller;

import com.nhom6.microservices.order.dto.OrderRequest;
import com.nhom6.microservices.order.dto.OrderResponse;
import com.nhom6.microservices.order.service.OrderService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    private OrderService orderService;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder (@RequestBody OrderRequest orderRequest) {
        orderService.placeOrder(orderRequest);
        return "Order Placed Successfully ";
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<OrderResponse> getAllOrders () {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderNumber}")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponse getOrder (@PathVariable String orderNumber) {
        return orderService.getOrder(orderNumber);
    }

    @PutMapping("/{orderNumber}")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponse updateOrder (@PathVariable String orderNumber,@RequestBody OrderRequest orderRequest) {
        return orderService.updateOrder(orderNumber, orderRequest);
    }


    @DeleteMapping("/{orderNumber}")
    public String deleteOrder (@PathVariable String orderNumber) {
        return orderService.deleteOrder(orderNumber);
    }
}
