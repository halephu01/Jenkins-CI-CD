package com.nhom6.microservices.identity_service.dto.respone;


import com.nhom6.microservices.identity_service.entity.Role;
import lombok.*;
import lombok.experimental.FieldNameConstants;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldNameConstants(level = AccessLevel.PRIVATE)
public class AuthenticationRespone {
    String token;
    boolean isAuthenticated;
    Set<Role> role;
}
