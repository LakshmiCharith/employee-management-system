package com.emp.ems.service.impl;

import com.emp.ems.dto.LeaveRequestDTO;
import com.emp.ems.entity.Employee;
import com.emp.ems.entity.LeaveRequest;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.EmployeeRepository;
import com.emp.ems.repository.LeaveRequestRepository;
import com.emp.ems.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public LeaveRequestDTO applyLeave(LeaveRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + dto.getEmployeeId()));

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(dto.getLeaveType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .reason(dto.getReason())
                .status("PENDING")
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public LeaveRequestDTO updateLeaveStatus(Long id, String status, String rejectionReason, Long approverEmployeeId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));

        Employee approver = null;
        if (approverEmployeeId != null) {
            approver = employeeRepository.findById(approverEmployeeId).orElse(null);
        }

        leaveRequest.setStatus(status);
        leaveRequest.setApprovedBy(approver);
        if (rejectionReason != null) {
            leaveRequest.setRejectionReason(rejectionReason);
        }

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return mapToDTO(updated);
    }

    @Override
    public List<LeaveRequestDTO> getEmployeeLeaves(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDTO> getAllLeaves() {
        return leaveRequestRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDTO> getPendingLeaves() {
        return leaveRequestRepository.findByStatusOrderByCreatedAtDesc("PENDING").stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Integer> getLeaveBalance(Long employeeId) {
        Map<String, Integer> balances = new HashMap<>();
        balances.put("SICK", 10);
        balances.put("CASUAL", 12);
        balances.put("ANNUAL", 15);
        return balances;
    }

    private LeaveRequestDTO mapToDTO(LeaveRequest leaveRequest) {
        return LeaveRequestDTO.builder()
                .id(leaveRequest.getId())
                .employeeId(leaveRequest.getEmployee().getId())
                .employeeName(leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName())
                .employeeCode(leaveRequest.getEmployee().getEmployeeIdCode())
                .leaveType(leaveRequest.getLeaveType())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .reason(leaveRequest.getReason())
                .status(leaveRequest.getStatus())
                .approvedById(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getId() : null)
                .approvedByName(leaveRequest.getApprovedBy() != null ? leaveRequest.getApprovedBy().getFirstName() + " " + leaveRequest.getApprovedBy().getLastName() : null)
                .rejectionReason(leaveRequest.getRejectionReason())
                .build();
    }
}
