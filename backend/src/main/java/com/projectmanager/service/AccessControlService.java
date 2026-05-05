package com.projectmanager.service;

import com.projectmanager.entity.ProjectMember;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.entity.enums.ProjectRole;
import com.projectmanager.exception.ForbiddenException;
import com.projectmanager.repository.ProjectMemberRepository;
import com.projectmanager.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final ProjectMemberRepository projectMemberRepository;

    public void requireGlobalAdmin(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        if (userDetails.getRole() != GlobalRole.ADMIN) {
            throw new ForbiddenException("Requires global ADMIN role");
        }
    }

    public void requireProjectMember(UUID projectId, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        // Global admins have access to everything
        if (userDetails.getRole() == GlobalRole.ADMIN) {
            return;
        }

        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, userDetails.getId())) {
            throw new ForbiddenException("You are not a member of this project");
        }
    }

    public void requireProjectAdmin(UUID projectId, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        // Global admins have access to everything
        if (userDetails.getRole() == GlobalRole.ADMIN) {
            return;
        }

        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userDetails.getId())
                .orElseThrow(() -> new ForbiddenException("You are not a member of this project"));

        if (member.getRole() != ProjectRole.ADMIN) {
            throw new ForbiddenException("Requires project ADMIN role");
        }
    }

    public boolean isProjectAdmin(UUID projectId, UUID userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(member -> member.getRole() == ProjectRole.ADMIN)
                .orElse(false);
    }

    public boolean isAssignee(Task task, UUID userId) {
        return task.getAssignee() != null && task.getAssignee().getId().equals(userId);
    }
}
