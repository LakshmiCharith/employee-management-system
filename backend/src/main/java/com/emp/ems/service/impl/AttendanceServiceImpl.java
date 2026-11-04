package com.emp.ems.service.impl;

import com.emp.ems.dto.AttendanceDTO;
import com.emp.ems.entity.Attendance;
import com.emp.ems.entity.Employee;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.AttendanceRepository;
import com.emp.ems.repository.EmployeeRepository;
import com.emp.ems.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public AttendanceDTO markAttendance(AttendanceDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + dto.getEmployeeId()));

        LocalDate targetDate = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        Optional<Attendance> existingOpt = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), targetDate);

        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            if (dto.getCheckOut() != null) {
                attendance.setCheckOut(dto.getCheckOut());
            } else if (attendance.getCheckOut() == null && "PRESENT".equalsIgnoreCase(attendance.getStatus())) {
                attendance.setCheckOut(LocalTime.now());
            }
            if (dto.getStatus() != null) {
                attendance.setStatus(dto.getStatus());
            }
            if (dto.getNotes() != null) {
                attendance.setNotes(dto.getNotes());
            }
        } else {
            attendance = Attendance.builder()
                    .employee(employee)
                    .date(targetDate)
                    .checkIn(dto.getCheckIn() != null ? dto.getCheckIn() : LocalTime.now())
                    .checkOut(dto.getCheckOut())
                    .status(dto.getStatus() != null ? dto.getStatus() : "PRESENT")
                    .notes(dto.getNotes())
                    .build();
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDTO(saved);
    }

    @Override
    public List<AttendanceDTO> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AttendanceDTO mapToDTO(Attendance attendance) {
        return AttendanceDTO.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName())
                .employeeCode(attendance.getEmployee().getEmployeeIdCode())
                .date(attendance.getDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .status(attendance.getStatus())
                .notes(attendance.getNotes())
                .build();
    }
}
