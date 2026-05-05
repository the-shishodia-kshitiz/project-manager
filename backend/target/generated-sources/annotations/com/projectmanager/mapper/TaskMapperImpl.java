package com.projectmanager.mapper;

import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-05T14:03:17+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class TaskMapperImpl implements TaskMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public TaskResponse toResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        TaskResponse.TaskResponseBuilder taskResponse = TaskResponse.builder();

        taskResponse.projectId( taskProjectId( task ) );
        taskResponse.id( task.getId() );
        taskResponse.title( task.getTitle() );
        taskResponse.description( task.getDescription() );
        taskResponse.status( task.getStatus() );
        taskResponse.priority( task.getPriority() );
        taskResponse.dueDate( task.getDueDate() );
        taskResponse.assignee( userMapper.toResponse( task.getAssignee() ) );
        taskResponse.createdBy( userMapper.toResponse( task.getCreatedBy() ) );
        taskResponse.createdAt( task.getCreatedAt() );
        taskResponse.updatedAt( task.getUpdatedAt() );

        return taskResponse.build();
    }

    private UUID taskProjectId(Task task) {
        if ( task == null ) {
            return null;
        }
        Project project = task.getProject();
        if ( project == null ) {
            return null;
        }
        UUID id = project.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
