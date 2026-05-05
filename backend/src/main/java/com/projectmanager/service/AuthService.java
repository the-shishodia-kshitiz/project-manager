package com.projectmanager.service;

import com.projectmanager.dto.request.LoginRequest;
import com.projectmanager.dto.request.RefreshTokenRequest;
import com.projectmanager.dto.request.SignupRequest;
import com.projectmanager.dto.response.AuthResponse;
import com.projectmanager.entity.User;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.exception.DuplicateResourceException;
import com.projectmanager.exception.ForbiddenException;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.mapper.UserMapper;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.security.JwtTokenProvider;
import com.projectmanager.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(GlobalRole.MEMBER)
                .build();

        user = userRepository.save(user);

        // Auto-login after signup
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        return generateTokensAndResponse(authentication, user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return generateTokensAndResponse(authentication, user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(requestRefreshToken)) {
            throw new ForbiddenException("Invalid refresh token");
        }

        String userIdStr = jwtTokenProvider.getUserIdFromToken(requestRefreshToken);
        UUID userId = UUID.fromString(userIdStr);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(requestRefreshToken)) {
            throw new ForbiddenException("Refresh token is invalid or has been revoked");
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        
        return generateTokensAndResponse(authentication, user);
    }

    @Transactional
    public void logout(Authentication authentication) {
        if (authentication == null) return;
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    private AuthResponse generateTokensAndResponse(Authentication authentication, User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toResponse(user))
                .build();
    }
}
