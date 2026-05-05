package com.projectmanager.service;

import com.projectmanager.dto.request.CreateProjectRequest;
import com.projectmanager.dto.request.UpdateProjectRequest;
import com.projectmanager.dto.response.ProjectDetailResponse;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.ProjectMember;
import com.projectmanager.entity.User;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.entity.enums.ProjectRole;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.mapper.ProjectMapper;
import com.projectmanager.repository.ProjectMemberRepository;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectMapper projectMapper;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        List<Project> projects;
        if (userDetails.getRole() == GlobalRole.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findAllProjectsForUser(userDetails.getId());
        }
        
        return projects.stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User owner = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        project = projectRepository.save(project);

        // Auto-add creator as project admin
        ProjectMember adminMember = ProjectMember.builder()
                .project(project)
                .user(owner)
                .role(ProjectRole.ADMIN)
                .build();
        
        projectMemberRepository.save(adminMember);

        return projectMapper.toResponse(project);
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetails(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        return projectMapper.toDetailResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found");
        }
        projectRepository.deleteById(id);
    }
}
