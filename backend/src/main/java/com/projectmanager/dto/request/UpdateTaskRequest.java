package com.projectmanager.dto.request;

import com.projectmanager.entity.enums.TaskPriority;
import com.projectmanager.entity.enums.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateTaskRequest {
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;

    private UUID assigneeId;
}
