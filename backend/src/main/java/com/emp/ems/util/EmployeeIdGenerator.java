package com.emp.ems.util;

import com.emp.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
@RequiredArgsConstructor
public class EmployeeIdGenerator {

    private final EmployeeRepository employeeRepository;

    public String generateNextEmployeeId() {
        int currentYear = Year.now().getValue();
        long count = employeeRepository.count() + 1;
        
        String code;
        do {
            code = String.format("EMP-%d-%03d", currentYear, count);
            count++;
        } while (employeeRepository.existsByEmployeeIdCode(code));

        return code;
    }
}
