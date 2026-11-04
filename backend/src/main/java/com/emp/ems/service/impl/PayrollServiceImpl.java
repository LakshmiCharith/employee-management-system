package com.emp.ems.service.impl;

import com.emp.ems.dto.PayrollRequestDTO;
import com.emp.ems.dto.PayrollResponseDTO;
import com.emp.ems.entity.Employee;
import com.emp.ems.entity.Payroll;
import com.emp.ems.exception.BadRequestException;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.EmployeeRepository;
import com.emp.ems.repository.PayrollRepository;
import com.emp.ems.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public PayrollResponseDTO generatePayroll(PayrollRequestDTO requestDTO) {
        Employee employee = employeeRepository.findById(requestDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + requestDTO.getEmployeeId()));

        Optional<Payroll> existingOpt = payrollRepository.findByEmployeeIdAndPayPeriod(employee.getId(), requestDTO.getPayPeriod());
        if (existingOpt.isPresent()) {
            throw new BadRequestException("Payroll already processed for this employee in period: " + requestDTO.getPayPeriod());
        }

        BigDecimal baseSalary = employee.getSalary().divide(BigDecimal.valueOf(12), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal bonuses = requestDTO.getBonuses() != null ? requestDTO.getBonuses() : BigDecimal.ZERO;
        BigDecimal deductions = requestDTO.getDeductions() != null ? requestDTO.getDeductions() : BigDecimal.ZERO;
        BigDecimal netSalary = baseSalary.add(bonuses).subtract(deductions);

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .payPeriod(requestDTO.getPayPeriod())
                .basicSalary(baseSalary)
                .bonuses(bonuses)
                .deductions(deductions)
                .netSalary(netSalary)
                .paymentStatus("PAID")
                .paymentDate(LocalDate.now())
                .build();

        Payroll saved = payrollRepository.save(payroll);
        return mapToDTO(saved);
    }

    @Override
    public List<PayrollResponseDTO> getEmployeePayrolls(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByPayPeriodDesc(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PayrollResponseDTO getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with ID: " + id));
        return mapToDTO(payroll);
    }

    @Override
    public List<PayrollResponseDTO> getAllPayrolls(String payPeriod) {
        List<Payroll> list = (payPeriod != null && !payPeriod.isBlank())
                ? payrollRepository.findByPayPeriod(payPeriod)
                : payrollRepository.findAll();

        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private PayrollResponseDTO mapToDTO(Payroll payroll) {
        Employee e = payroll.getEmployee();
        return PayrollResponseDTO.builder()
                .id(payroll.getId())
                .employeeId(e.getId())
                .employeeName(e.getFirstName() + " " + e.getLastName())
                .employeeCode(e.getEmployeeIdCode())
                .designation(e.getDesignation())
                .departmentName(e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned")
                .payPeriod(payroll.getPayPeriod())
                .basicSalary(payroll.getBasicSalary())
                .bonuses(payroll.getBonuses())
                .deductions(payroll.getDeductions())
                .netSalary(payroll.getNetSalary())
                .paymentStatus(payroll.getPaymentStatus())
                .paymentDate(payroll.getPaymentDate())
                .build();
    }
}
