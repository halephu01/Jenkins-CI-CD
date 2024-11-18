package com.nhom6.microservices.identity_service.controller;


import com.nhom6.microservices.identity_service.dto.request.ApiResponse;
import com.nhom6.microservices.identity_service.dto.request.PermissionRequest;
import com.nhom6.microservices.identity_service.dto.respone.PermissionResponse;
import com.nhom6.microservices.identity_service.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request) {
        return  ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createPermission(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getPermissions() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();

    }

    @DeleteMapping({"/{permission}"})
    ApiResponse<Void> deletePermission(@PathVariable("permission") String permission) {
        permissionService.deletePermission(permission);
        return ApiResponse.<Void>builder().build();
    }

}
