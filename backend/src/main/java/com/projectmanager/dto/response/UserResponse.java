package com.projectmanager.dto.response;

import com.projectmanager.entity.enums.GlobalRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private GlobalRole role;
}
