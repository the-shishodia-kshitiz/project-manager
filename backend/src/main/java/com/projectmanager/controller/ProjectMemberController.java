package com.projectmanager.controller;

import com.projectmanager.dto.request.AddMemberRequest;
import com.projectmanager.dto.response.ProjectMemberResponse;
import com.projectmanager.service.AccessControlService;
import com.projectmanager.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;
    private final AccessControlService accessControlService;

    @GetMapping
    public ResponseEntity<List<ProjectMemberResponse>> getMembers(@PathVariable UUID projectId, Authentication authentication) {
        accessControlService.requireProjectMember(projectId, authentication);
        return ResponseEntity.ok(projectMemberService.getMembers(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectMemberResponse> addMember(@PathVariable UUID projectId, @Valid @RequestBody AddMemberRequest request, Authentication authentication) {
        accessControlService.requireProjectAdmin(projectId, authentication);
        return new ResponseEntity<>(projectMemberService.addMember(projectId, request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable UUID projectId, @PathVariable UUID userId, Authentication authentication) {
        accessControlService.requireProjectAdmin(projectId, authentication);
        projectMemberService.removeMember(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}
