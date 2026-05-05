package com.projectmanager.mapper;

import com.projectmanager.dto.response.ProjectDetailResponse;
import com.projectmanager.dto.response.ProjectMemberResponse;
import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.ProjectMember;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-05T14:03:17+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public ProjectResponse toResponse(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectResponse.ProjectResponseBuilder projectResponse = ProjectResponse.builder();

        projectResponse.memberCount( mapMemberCount( project.getMembers() ) );
        projectResponse.taskCount( mapTaskCount( project.getTasks() ) );
        projectResponse.id( project.getId() );
        projectResponse.name( project.getName() );
        projectResponse.description( project.getDescription() );
        projectResponse.owner( userMapper.toResponse( project.getOwner() ) );
        projectResponse.createdAt( project.getCreatedAt() );
        projectResponse.updatedAt( project.getUpdatedAt() );

        return projectResponse.build();
    }

    @Override
    public ProjectDetailResponse toDetailResponse(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectDetailResponse.ProjectDetailResponseBuilder projectDetailResponse = ProjectDetailResponse.builder();

        projectDetailResponse.id( project.getId() );
        projectDetailResponse.name( project.getName() );
        projectDetailResponse.description( project.getDescription() );
        projectDetailResponse.owner( userMapper.toResponse( project.getOwner() ) );
        projectDetailResponse.createdAt( project.getCreatedAt() );
        projectDetailResponse.updatedAt( project.getUpdatedAt() );
        projectDetailResponse.members( projectMemberListToProjectMemberResponseList( project.getMembers() ) );

        projectDetailResponse.todoCount( countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.TODO) );
        projectDetailResponse.inProgressCount( countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.IN_PROGRESS) );
        projectDetailResponse.doneCount( countTasksByStatus(project.getTasks(), com.projectmanager.entity.enums.TaskStatus.DONE) );

        return projectDetailResponse.build();
    }

    @Override
    public ProjectMemberResponse toMemberResponse(ProjectMember member) {
        if ( member == null ) {
            return null;
        }

        ProjectMemberResponse.ProjectMemberResponseBuilder projectMemberResponse = ProjectMemberResponse.builder();

        projectMemberResponse.user( userMapper.toResponse( member.getUser() ) );
        projectMemberResponse.role( member.getRole() );
        projectMemberResponse.joinedAt( member.getJoinedAt() );

        return projectMemberResponse.build();
    }

    protected List<ProjectMemberResponse> projectMemberListToProjectMemberResponseList(List<ProjectMember> list) {
        if ( list == null ) {
            return null;
        }

        List<ProjectMemberResponse> list1 = new ArrayList<ProjectMemberResponse>( list.size() );
        for ( ProjectMember projectMember : list ) {
            list1.add( toMemberResponse( projectMember ) );
        }

        return list1;
    }
}
