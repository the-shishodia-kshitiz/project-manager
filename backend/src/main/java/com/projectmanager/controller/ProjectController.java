package com.projectmanager.controller;

import com.projectmanager.dto.request.CreateProjectRequest;
import com.projectmanager.dto.request.UpdateProjectRequest;
import com.projectmanager.dto.response.ProjectDetailResponse;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.service.AccessControlService;
import com.projectmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AccessControlService accessControlService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(Authentication authentication) {
        return ResponseEntity.ok(projectService.getAllProjects(authentication));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request, Authentication authentication) {
        return new ResponseEntity<>(projectService.createProject(request, authentication), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetails(@PathVariable UUID id, Authentication authentication) {
        accessControlService.requireProjectMember(id, authentication);
        return ResponseEntity.ok(projectService.getProjectDetails(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable UUID id, @Valid @RequestBody UpdateProjectRequest request, Authentication authentication) {
        accessControlService.requireProjectAdmin(id, authentication);
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id, Authentication authentication) {
        accessControlService.requireProjectAdmin(id, authentication);
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
