package com.emp.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private double todayAttendanceRate;
    private BigDecimal monthlyPayrollCost;
    private long pendingLeaveRequests;
    private List<RecentEmployeeDTO> recentEmployees;
    private Map<String, Long> departmentDistribution;
    private List<ActivityLogDTO> recentActivities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentEmployeeDTO {
        private Long id;
        private String employeeIdCode;
        private String fullName;
        private String designation;
        private String departmentName;
        private String joiningDate;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityLogDTO {
        private String id;
        private String title;
        private String description;
        private String timestamp;
        private String type; // 'PRIMARY', 'SUCCESS', 'WARNING', 'INFO'
    }
}
