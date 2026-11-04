package com.emp.ems.controller;

import com.emp.ems.dto.ApiResponse;
import com.emp.ems.dto.PayrollRequestDTO;
import com.emp.ems.dto.PayrollResponseDTO;
import com.emp.ems.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<PayrollResponseDTO>> generatePayroll(@Valid @RequestBody PayrollRequestDTO requestDTO) {
        PayrollResponseDTO processed = payrollService.generatePayroll(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payroll processed successfully", processed));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<PayrollResponseDTO>>> getEmployeePayrolls(@PathVariable Long employeeId) {
        List<PayrollResponseDTO> records = payrollService.getEmployeePayrolls(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee payroll records fetched", records));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollResponseDTO>> getPayrollById(@PathVariable Long id) {
        PayrollResponseDTO record = payrollService.getPayrollById(id);
        return ResponseEntity.ok(ApiResponse.success("Payroll record fetched", record));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PayrollResponseDTO>>> getAllPayrolls(@RequestParam(required = false) String payPeriod) {
        List<PayrollResponseDTO> records = payrollService.getAllPayrolls(payPeriod);
        return ResponseEntity.ok(ApiResponse.success("Payroll history retrieved successfully", records));
    }
}
