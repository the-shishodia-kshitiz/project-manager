package com.projectmanager.mapper;

import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {

    @Mapping(target = "projectId", source = "project.id")
    TaskResponse toResponse(Task task);
}
