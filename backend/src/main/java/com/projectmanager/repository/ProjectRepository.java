package com.projectmanager.repository;

import com.projectmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE m.user.id = :userId OR p.owner.id = :userId")
    List<Project> findAllProjectsForUser(@Param("userId") UUID userId);
}
