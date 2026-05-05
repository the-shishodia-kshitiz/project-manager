package com.projectmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private UserResponse owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Summary fields for lists
    private int memberCount;
    private int taskCount;
}
