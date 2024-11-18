package com.nhom6.microservices.identity_service.mapper;

import com.nhom6.microservices.identity_service.dto.request.RoleRequest;
import com.nhom6.microservices.identity_service.dto.respone.RoleResponse;
import com.nhom6.microservices.identity_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
