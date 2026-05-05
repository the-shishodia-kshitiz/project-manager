package com.projectmanager.repository;

import com.projectmanager.entity.Task;
import com.projectmanager.entity.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    
    Page<Task> findByProjectId(UUID projectId, Pageable pageable);
    
    List<Task> findByAssigneeId(UUID assigneeId);
    
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
