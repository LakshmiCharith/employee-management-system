package com.emp.ems.service;

import com.emp.ems.dto.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getAdminDashboardStats();
    DashboardStatsDTO getEmployeeDashboardStats(Long userId);
}
