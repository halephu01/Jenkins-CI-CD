package com.nhom6.microservices.identity_service.service;


import com.nhom6.microservices.identity_service.dto.request.PermissionRequest;
import com.nhom6.microservices.identity_service.dto.respone.PermissionResponse;
import com.nhom6.microservices.identity_service.entity.Permission;
import com.nhom6.microservices.identity_service.mapper.PermissionMapper;
import com.nhom6.microservices.identity_service.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {

    PermissionRepository permissionRepository;

    PermissionMapper  permissionMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(permissionMapper::toPermissionResponse).toList();
    }


    public void deletePermission(String permissionName) {
        permissionRepository.deleteById(permissionName);
    }
}
