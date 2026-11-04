package com.emp.ems.controller;

import com.emp.ems.dto.ApiResponse;
import com.emp.ems.dto.LeaveRequestDTO;
import com.emp.ems.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequestDTO>> applyLeave(@Valid @RequestBody LeaveRequestDTO dto) {
        LeaveRequestDTO applied = leaveService.applyLeave(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Leave request submitted successfully", applied));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LeaveRequestDTO>> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam(required = false) Long approverId) {
        LeaveRequestDTO updated = leaveService.updateLeaveStatus(id, status, rejectionReason, approverId);
        return ResponseEntity.ok(ApiResponse.success("Leave status updated to: " + status, updated));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveRequestDTO>>> getEmployeeLeaves(@PathVariable Long employeeId) {
        List<LeaveRequestDTO> leaves = leaveService.getEmployeeLeaves(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee leave history fetched", leaves));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequestDTO>>> getAllLeaves() {
        List<LeaveRequestDTO> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(ApiResponse.success("All leave requests retrieved", leaves));
    }

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getLeaveBalance(@PathVariable Long employeeId) {
        Map<String, Integer> balance = leaveService.getLeaveBalance(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Leave balance calculated", balance));
    }
}
