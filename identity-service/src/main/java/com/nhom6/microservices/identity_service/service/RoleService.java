package com.nhom6.microservices.identity_service.service;


import com.nhom6.microservices.identity_service.dto.request.RoleRequest;
import com.nhom6.microservices.identity_service.dto.respone.RoleResponse;
import com.nhom6.microservices.identity_service.mapper.RoleMapper;
import com.nhom6.microservices.identity_service.repository.PermissionRepository;
import com.nhom6.microservices.identity_service.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse createRole(RoleRequest roleRequest) {
        var role = roleMapper.toRole(roleRequest);
        var permissions =  permissionRepository.findAllById(roleRequest.getPermissions());

        role.setPermissions(new HashSet<>(permissions));
        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                            .stream()
                            .map(roleMapper::toRoleResponse).toList();
    }

    public void deleteRole(String role) {
        roleRepository.deleteById(role);
    }
}
