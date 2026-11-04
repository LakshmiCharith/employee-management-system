package com.emp.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayrollRequestDTO {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotBlank(message = "Pay period is required")
    private String payPeriod; // YYYY-MM

    private BigDecimal bonuses;
    private BigDecimal deductions;
}
