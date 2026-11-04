package com.emp.ems.service;

import com.emp.ems.dto.AttendanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceDTO markAttendance(AttendanceDTO dto);
    List<AttendanceDTO> getEmployeeAttendance(Long employeeId);
    List<AttendanceDTO> getAttendanceByDate(LocalDate date);
}
