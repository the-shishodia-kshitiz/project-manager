package com.projectmanager.service;

import com.projectmanager.dto.response.PagedResponse;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.User;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.mapper.UserMapper;
import com.projectmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return PagedResponse.of(users.map(userMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse changeUserRole(UUID id, GlobalRole newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setRole(newRole);
        return userMapper.toResponse(userRepository.save(user));
    }
}
