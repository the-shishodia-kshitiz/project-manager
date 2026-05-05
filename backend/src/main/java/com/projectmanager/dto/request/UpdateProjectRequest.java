package com.projectmanager.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProjectRequest {
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}
