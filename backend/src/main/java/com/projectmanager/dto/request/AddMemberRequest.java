package com.projectmanager.dto.request;

import com.projectmanager.entity.enums.ProjectRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddMemberRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Role is required")
    private ProjectRole role;
}
