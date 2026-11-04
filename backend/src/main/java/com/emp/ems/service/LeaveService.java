package com.emp.ems.service;

import com.emp.ems.dto.LeaveRequestDTO;

import java.util.List;
import java.util.Map;

public interface LeaveService {
    LeaveRequestDTO applyLeave(LeaveRequestDTO dto);
    LeaveRequestDTO updateLeaveStatus(Long id, String status, String rejectionReason, Long approverEmployeeId);
    List<LeaveRequestDTO> getEmployeeLeaves(Long employeeId);
    List<LeaveRequestDTO> getAllLeaves();
    List<LeaveRequestDTO> getPendingLeaves();
    Map<String, Integer> getLeaveBalance(Long employeeId);
}
