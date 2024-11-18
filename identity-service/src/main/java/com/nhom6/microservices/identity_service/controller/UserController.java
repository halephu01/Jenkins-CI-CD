package com.nhom6.microservices.identity_service.controller;

import com.nhom6.microservices.identity_service.configuration.SecurityConfig;
import com.nhom6.microservices.identity_service.dto.request.ApiResponse;
import com.nhom6.microservices.identity_service.dto.request.UserCreationRequest;
import com.nhom6.microservices.identity_service.dto.request.UserUpdateRequest;
import com.nhom6.microservices.identity_service.dto.respone.UserResponse;
import com.nhom6.microservices.identity_service.entity.User;
import com.nhom6.microservices.identity_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));

        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }

    @GetMapping("/myinfo")
    public ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @GetMapping("/{userid}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String userid) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(userid))
                .build();
    }

    @PutMapping("/myinfo")
    public ApiResponse<UserResponse> updateUser(@RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updatemyinfo(request))
                .build();
    }

    @PutMapping("/{userid}")
    public UserResponse updateUser(@PathVariable String userid, @RequestBody UserUpdateRequest request)
    {
        return userService.updateUser(userid, request);
    }

    @DeleteMapping("/{userid}")
    public String deleteUser(@PathVariable String userid) {
        return userService.deleteUser(userid);
    }

}
