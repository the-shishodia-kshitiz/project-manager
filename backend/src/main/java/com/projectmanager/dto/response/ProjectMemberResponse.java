package com.projectmanager.dto.response;

import com.projectmanager.entity.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMemberResponse {
    private UserResponse user;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}
