package com.emp.ems.service;

import com.emp.ems.dto.PayrollRequestDTO;
import com.emp.ems.dto.PayrollResponseDTO;

import java.util.List;

public interface PayrollService {
    PayrollResponseDTO generatePayroll(PayrollRequestDTO requestDTO);
    List<PayrollResponseDTO> getEmployeePayrolls(Long employeeId);
    PayrollResponseDTO getPayrollById(Long id);
    List<PayrollResponseDTO> getAllPayrolls(String payPeriod);
}
