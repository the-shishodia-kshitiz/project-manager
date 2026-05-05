package com.projectmanager.controller;

import com.projectmanager.dto.request.CreateTaskRequest;
import com.projectmanager.dto.request.UpdateTaskRequest;
import com.projectmanager.dto.response.PagedResponse;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.service.AccessControlService;
import com.projectmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final AccessControlService accessControlService;

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<PagedResponse<TaskResponse>> getTasks(@PathVariable UUID projectId, Pageable pageable, Authentication authentication) {
        accessControlService.requireProjectMember(projectId, authentication);
        return ResponseEntity.ok(taskService.getTasks(projectId, pageable));
    }

    @PostMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(@PathVariable UUID projectId, @Valid @RequestBody CreateTaskRequest request, Authentication authentication) {
        accessControlService.requireProjectAdmin(projectId, authentication);
        return new ResponseEntity<>(taskService.createTask(projectId, request, authentication), HttpStatus.CREATED);
    }

    @GetMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID taskId, Authentication authentication) {
        TaskResponse task = taskService.getTask(taskId);
        accessControlService.requireProjectMember(task.getProjectId(), authentication);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID taskId, @Valid @RequestBody UpdateTaskRequest request, Authentication authentication) {
        // Access control logic is inside the service for task updates
        return ResponseEntity.ok(taskService.updateTask(taskId, request, authentication));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId, Authentication authentication) {
        TaskResponse task = taskService.getTask(taskId);
        accessControlService.requireProjectAdmin(task.getProjectId(), authentication);
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
