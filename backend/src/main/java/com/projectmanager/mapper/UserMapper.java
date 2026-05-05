package com.projectmanager.mapper;

import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserResponse toResponse(User user);
}
