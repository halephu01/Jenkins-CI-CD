package com.nhom6.microservices.identity_service.controller;


import com.nhom6.microservices.identity_service.dto.request.ApiResponse;
import com.nhom6.microservices.identity_service.dto.request.PermissionRequest;
import com.nhom6.microservices.identity_service.dto.request.RoleRequest;
import com.nhom6.microservices.identity_service.dto.respone.PermissionResponse;
import com.nhom6.microservices.identity_service.dto.respone.RoleResponse;
import com.nhom6.microservices.identity_service.service.PermissionService;
import com.nhom6.microservices.identity_service.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest roleRequest) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(roleRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    @DeleteMapping({"/{role}"})
    ApiResponse<Void> deletePermission(@PathVariable("role") String role) {
        roleService.deleteRole(role);
        return ApiResponse.<Void>builder().build();
    }

}
