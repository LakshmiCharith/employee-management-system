package com.emp.ems.controller;

import com.emp.ems.dto.ApiResponse;
import com.emp.ems.dto.AttendanceDTO;
import com.emp.ems.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<ApiResponse<AttendanceDTO>> markAttendance(@Valid @RequestBody AttendanceDTO dto) {
        AttendanceDTO saved = attendanceService.markAttendance(dto);
        return ResponseEntity.ok(ApiResponse.success("Attendance recorded successfully", saved));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getEmployeeAttendance(@PathVariable Long employeeId) {
        List<AttendanceDTO> history = attendanceService.getEmployeeAttendance(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Attendance history retrieved", history));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getTodayAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<AttendanceDTO> records = attendanceService.getAttendanceByDate(targetDate);
        return ResponseEntity.ok(ApiResponse.success("Attendance records retrieved for date: " + targetDate, records));
    }
}
