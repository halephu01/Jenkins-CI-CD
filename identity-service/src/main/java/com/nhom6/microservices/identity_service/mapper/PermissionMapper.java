package com.nhom6.microservices.identity_service.mapper;

import com.nhom6.microservices.identity_service.dto.request.PermissionRequest;
import com.nhom6.microservices.identity_service.dto.respone.PermissionResponse;
import com.nhom6.microservices.identity_service.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest permissionRequest);

    PermissionResponse toPermissionResponse(Permission permission);


}
