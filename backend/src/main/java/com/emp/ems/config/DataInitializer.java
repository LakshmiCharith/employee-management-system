package com.emp.ems.config;

import com.emp.ems.entity.*;
import com.emp.ems.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

        Role empRole = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_EMPLOYEE").build()));

        // 2. Seed Default Department
        Department engineering = departmentRepository.findByDepartmentCode("ENG")
                .orElseGet(() -> departmentRepository.save(Department.builder()
                        .departmentCode("ENG")
                        .name("Engineering")
                        .description("Software Development and Core Infrastructure")
                        .build()));

        Department hr = departmentRepository.findByDepartmentCode("HR")
                .orElseGet(() -> departmentRepository.save(Department.builder()
                        .departmentCode("HR")
                        .name("Human Resources")
                        .description("Talent Acquisition and People Operations")
                        .build()));

        // 3. Seed Admin User
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@company.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .isActive(true)
                    .build();
            adminUser = userRepository.save(adminUser);

            Employee adminEmp = Employee.builder()
                    .employeeIdCode("EMP-2026-001")
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .email("admin@company.com")
                    .phone("+1 555-0192")
                    .designation("Head of HR Operations")
                    .department(hr)
                    .user(adminUser)
                    .joiningDate(LocalDate.of(2022, 1, 15))
                    .salary(new BigDecimal("125000.00"))
                    .status("ACTIVE")
                    .build();
            adminEmp = employeeRepository.save(adminEmp);

            hr.setHeadEmployee(adminEmp);
            departmentRepository.save(hr);
        }

        // 4. Seed Employee User
        if (!userRepository.existsByUsername("employee")) {
            User empUser = User.builder()
                    .username("employee")
                    .email("alex.morgan@company.com")
                    .password(passwordEncoder.encode("emp123"))
                    .role(empRole)
                    .isActive(true)
                    .build();
            empUser = userRepository.save(empUser);

            Employee emp = Employee.builder()
                    .employeeIdCode("EMP-2026-002")
                    .firstName("Alex")
                    .lastName("Morgan")
                    .email("alex.morgan@company.com")
                    .phone("+1 555-0824")
                    .designation("Senior Full Stack Developer")
                    .department(engineering)
                    .user(empUser)
                    .joiningDate(LocalDate.of(2023, 3, 10))
                    .salary(new BigDecimal("95000.00"))
                    .status("ACTIVE")
                    .build();
            employeeRepository.save(emp);
        }
    }
}
