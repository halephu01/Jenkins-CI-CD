package com.nhom6.microservices.identity_service.dto.request;

import lombok.*;
import lombok.experimental.FieldNameConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    String username;
    String password;
}
