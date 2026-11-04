package com.emp.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {

    private Long id;
    private String employeeIdCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Long userId;
    private String username;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private String status;
    private String profileImagePath;
}
