package com.projectmanager.service;

import com.projectmanager.dto.request.AddMemberRequest;
import com.projectmanager.dto.response.ProjectMemberResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.ProjectMember;
import com.projectmanager.entity.User;
import com.projectmanager.exception.BadRequestException;
import com.projectmanager.exception.DuplicateResourceException;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.mapper.ProjectMapper;
import com.projectmanager.repository.ProjectMemberRepository;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMembers(UUID projectId) {
        return projectMemberRepository.findByProjectId(projectId).stream()
                .map(projectMapper::toMemberResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectMemberResponse addMember(UUID projectId, AddMemberRequest request) {
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, request.getUserId())) {
            throw new DuplicateResourceException("User is already a member of this project");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProjectMember newMember = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.getRole())
                .build();

        return projectMapper.toMemberResponse(projectMemberRepository.save(newMember));
    }

    @Transactional
    public void removeMember(UUID projectId, UUID userId) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));
        
        if (member.getProject().getOwner().getId().equals(userId)) {
            throw new BadRequestException("Cannot remove the project owner");
        }

        projectMemberRepository.delete(member);
    }
}
