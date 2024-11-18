package com.nhom6.microservices.identity_service.repository;

import com.nhom6.microservices.identity_service.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {

}
