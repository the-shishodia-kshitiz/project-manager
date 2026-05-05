package com.projectmanager.controller;

import com.projectmanager.dto.response.PagedResponse;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<PagedResponse<UserResponse>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> changeUserRole(@PathVariable UUID id, @RequestParam GlobalRole role) {
        return ResponseEntity.ok(userService.changeUserRole(id, role));
    }
}
