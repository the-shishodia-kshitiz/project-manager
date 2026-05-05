package com.projectmanager.service;

import com.projectmanager.dto.request.CreateTaskRequest;
import com.projectmanager.dto.request.UpdateTaskRequest;
import com.projectmanager.dto.response.PagedResponse;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.entity.enums.GlobalRole;
import com.projectmanager.exception.ForbiddenException;
import com.projectmanager.exception.ResourceNotFoundException;
import com.projectmanager.mapper.TaskMapper;
import com.projectmanager.repository.ProjectRepository;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final AccessControlService accessControlService;

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getTasks(UUID projectId, Pageable pageable) {
        Page<Task> tasks = taskRepository.findByProjectId(projectId, pageable);
        return PagedResponse.of(tasks.map(taskMapper::toResponse));
    }

    @Transactional
    public TaskResponse createTask(UUID projectId, CreateTaskRequest request, Authentication auth) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User creator = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .project(project)
                .assignee(assignee)
                .createdBy(creator)
                .build();

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return taskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, Authentication auth) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        UUID userId = userDetails.getId();
        
        boolean isGlobalAdmin = userDetails.getRole() == GlobalRole.ADMIN;
        boolean isProjectAdmin = accessControlService.isProjectAdmin(task.getProject().getId(), userId);
        boolean isAssignee = accessControlService.isAssignee(task, userId);
        
        if (!isGlobalAdmin && !isProjectAdmin && !isAssignee) {
            throw new ForbiddenException("You do not have permission to update this task");
        }
        
        // If only assignee, can only update status
        if (!isGlobalAdmin && !isProjectAdmin && isAssignee) {
            if (request.getStatus() != null) {
                task.setStatus(request.getStatus());
            }
        } else {
            // Project admin or Global admin can update anything
            if (request.getTitle() != null) task.setTitle(request.getTitle());
            if (request.getDescription() != null) task.setDescription(request.getDescription());
            if (request.getStatus() != null) task.setStatus(request.getStatus());
            if (request.getPriority() != null) task.setPriority(request.getPriority());
            if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
            
            if (request.getAssigneeId() != null) {
                User assignee = userRepository.findById(request.getAssigneeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
                task.setAssignee(assignee);
            }
        }

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }
}
