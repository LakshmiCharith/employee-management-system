package com.emp.ems.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {

    private Long id;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;
    private String employeeName;
    private String employeeCode;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime checkIn;
    private LocalTime checkOut;

    @NotNull(message = "Status is required")
    private String status; // PRESENT, ABSENT, LEAVE, HALF_DAY

    private String notes;
}
