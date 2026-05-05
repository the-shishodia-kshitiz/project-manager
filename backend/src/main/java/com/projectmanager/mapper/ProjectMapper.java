package com.projectmanager.mapper;

import com.projectmanager.dto.response.ProjectDetailResponse;
import com.projectmanager.dto.response.ProjectMemberResponse;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.ProjectMember;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.enums.TaskStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {

    @Mapping(target = "memberCount", source = "members", qualifiedByName = "mapMemberCount")
    @Mapping(target = "taskCount", source = "tasks", qualifiedByName = "mapTaskCount")
    ProjectResponse toResponse(Project project);

    @Mapping(target = "todoCount", expression = "java(countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.TODO))")
    @Mapping(target = "inProgressCount", expression = "java(countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.IN_PROGRESS))")
    @Mapping(target = "doneCount", expression = "java(countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.DONE))")
    ProjectDetailResponse toDetailResponse(Project project);

    ProjectMemberResponse toMemberResponse(ProjectMember member);

    @Named("mapMemberCount")
    default int mapMemberCount(List<ProjectMember> members) {
        return members != null ? members.size() : 0;
    }

    @Named("mapTaskCount")
    default int mapTaskCount(List<Task> tasks) {
        return tasks != null ? tasks.size() : 0;
    }

    default long countTasksByStatus(List<Task> tasks, TaskStatus status) {
        if (tasks == null) return 0;
        return tasks.stream().filter(t -> t.getStatus() == status).count();
    }
}
