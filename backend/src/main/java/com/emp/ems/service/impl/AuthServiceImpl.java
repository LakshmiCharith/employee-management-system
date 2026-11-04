package com.emp.ems.service.impl;

import com.emp.ems.dto.*;
import com.emp.ems.entity.Department;
import com.emp.ems.entity.Employee;
import com.emp.ems.entity.Role;
import com.emp.ems.entity.User;
import com.emp.ems.exception.BadRequestException;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.*;
import com.emp.ems.security.CustomUserDetails;
import com.emp.ems.security.JwtUtils;
import com.emp.ems.service.AuthService;
import com.emp.ems.util.EmployeeIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeIdGenerator employeeIdGenerator;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Optional<Employee> empOpt = employeeRepository.findByUserId(userDetails.getId());
        Long empId = empOpt.map(Employee::getId).orElse(null);
        String empCode = empOpt.map(Employee::getEmployeeIdCode).orElse(null);
        String fullName = empOpt.map(e -> e.getFirstName() + " " + e.getLastName()).orElse(userDetails.getUsername());

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .role(role)
                .employeeId(empId)
                .employeeCode(empCode)
                .fullName(fullName)
                .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        // Simulated password reset token dispatch
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!"RESET-TOKEN-EMS".equals(request.getToken())) {
            throw new BadRequestException("Invalid reset token provided");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void registerUser(SignupRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String targetRoleName = "ROLE_EMPLOYEE";
        if (request.getRole() != null && !request.getRole().isBlank()) {
            String r = request.getRole().trim().toUpperCase();
            targetRoleName = r.startsWith("ROLE_") ? r : "ROLE_" + r;
        }

        final String finalRoleName = targetRoleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(finalRoleName).build()));

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        if (dept == null) {
            dept = departmentRepository.findAll().stream().findFirst().orElseGet(() ->
                departmentRepository.save(Department.builder()
                        .departmentCode("ENG")
                        .name("Engineering")
                        .description("Software Development and Operations")
                        .build())
            );
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .build();
        user = userRepository.save(user);

        String empCode = employeeIdGenerator.generateNextEmployeeId();

        Employee employee = Employee.builder()
                .employeeIdCode(empCode)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .designation(request.getDesignation() != null ? request.getDesignation() : (targetRoleName.equals("ROLE_ADMIN") ? "Administrator" : "Employee"))
                .department(dept)
                .user(user)
                .joiningDate(LocalDate.now())
                .salary(BigDecimal.valueOf(75000.00))
                .status("ACTIVE")
                .build();
        employeeRepository.save(employee);
    }

    @Override
    public JwtResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());

        return JwtResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .employeeId(empOpt.map(Employee::getId).orElse(null))
                .employeeCode(empOpt.map(Employee::getEmployeeIdCode).orElse(null))
                .fullName(empOpt.map(e -> e.getFirstName() + " " + e.getLastName()).orElse(user.getUsername()))
                .build();
    }
}
