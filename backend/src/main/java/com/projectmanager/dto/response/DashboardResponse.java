package com.projectmanager.dto.response;

import com.projectmanager.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private int totalProjects;
    private int totalTasks;
    private Map<TaskStatus, Long> tasksByStatus;
    private List<TaskResponse> overdueTasks;
    private List<TaskResponse> myTasks;
}
