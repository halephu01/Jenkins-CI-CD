package com.nhom6.microservices.order.repository;

import com.nhom6.microservices.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository  extends JpaRepository<Order, Long> {
    Order findByOrderNumber(String orderNumber);

}
