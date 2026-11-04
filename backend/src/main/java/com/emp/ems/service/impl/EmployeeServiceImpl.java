package com.emp.ems.service.impl;

import com.emp.ems.dto.EmployeeRequestDTO;
import com.emp.ems.dto.EmployeeResponseDTO;
import com.emp.ems.entity.Department;
import com.emp.ems.entity.Employee;
import com.emp.ems.entity.Role;
import com.emp.ems.entity.User;
import com.emp.ems.exception.BadRequestException;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.DepartmentRepository;
import com.emp.ems.repository.EmployeeRepository;
import com.emp.ems.repository.RoleRepository;
import com.emp.ems.repository.UserRepository;
import com.emp.ems.service.EmployeeService;
import com.emp.ems.util.EmployeeIdGenerator;
import com.emp.ems.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployeeIdGenerator idGenerator;
    private final FileUploadUtil fileUploadUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO) {
        if (employeeRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BadRequestException("Employee email already exists: " + requestDTO.getEmail());
        }

        Department department = null;
        if (requestDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(requestDTO.getDepartmentId()).orElse(null);
        }
        if (department == null) {
            department = departmentRepository.findAll().stream().findFirst().orElseGet(() ->
                departmentRepository.save(Department.builder()
                        .departmentCode("ENG")
                        .name("Engineering")
                        .description("Software Development and Operations")
                        .build())
            );
        }

        String empCode = idGenerator.generateNextEmployeeId();

        // Create User account if username & password provided
        User user = null;
        if (requestDTO.getUsername() != null && !requestDTO.getUsername().isBlank()) {
            if (userRepository.existsByUsername(requestDTO.getUsername())) {
                throw new BadRequestException("Username already taken: " + requestDTO.getUsername());
            }
            Role role = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_EMPLOYEE").build()));

            user = User.builder()
                    .username(requestDTO.getUsername())
                    .email(requestDTO.getEmail())
                    .password(passwordEncoder.encode(requestDTO.getPassword() != null ? requestDTO.getPassword() : "emp123"))
                    .role(role)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
        }

        Employee employee = Employee.builder()
                .employeeIdCode(empCode)
                .firstName(requestDTO.getFirstName())
                .lastName(requestDTO.getLastName())
                .email(requestDTO.getEmail())
                .phone(requestDTO.getPhone())
                .designation(requestDTO.getDesignation())
                .department(department)
                .user(user)
                .joiningDate(requestDTO.getJoiningDate())
                .salary(requestDTO.getSalary())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : "ACTIVE")
                .build();

        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        if (!employee.getEmail().equalsIgnoreCase(requestDTO.getEmail()) && employeeRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BadRequestException("Email already taken by another employee: " + requestDTO.getEmail());
        }

        Department department = null;
        if (requestDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(requestDTO.getDepartmentId()).orElse(null);
        }
        if (department == null) {
            department = employee.getDepartment();
        }

        employee.setFirstName(requestDTO.getFirstName());
        employee.setLastName(requestDTO.getLastName());
        employee.setEmail(requestDTO.getEmail());
        employee.setPhone(requestDTO.getPhone());
        employee.setDesignation(requestDTO.getDesignation());
        employee.setDepartment(department);
        employee.setJoiningDate(requestDTO.getJoiningDate());
        employee.setSalary(requestDTO.getSalary());
        if (requestDTO.getStatus() != null) {
            employee.setStatus(requestDTO.getStatus());
        }

        Employee updated = employeeRepository.save(employee);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        employeeRepository.delete(employee);
    }

    @Override
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        return mapToDTO(employee);
    }

    @Override
    public Page<EmployeeResponseDTO> getEmployees(int page, int size, String sortBy, String sortDir, String search, Long departmentId, String status) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        List<Employee> allEmployees = employeeRepository.findAll();

        // In-memory stream filter for search, department, and status (suitable for showcase)
        List<EmployeeResponseDTO> filtered = allEmployees.stream()
                .filter(e -> {
                    if (search != null && !search.isBlank()) {
                        String query = search.toLowerCase();
                        boolean matchesName = (e.getFirstName() + " " + e.getLastName()).toLowerCase().contains(query);
                        boolean matchesEmail = e.getEmail().toLowerCase().contains(query);
                        boolean matchesCode = e.getEmployeeIdCode().toLowerCase().contains(query);
                        boolean matchesPhone = e.getPhone().contains(query);
                        if (!matchesName && !matchesEmail && !matchesCode && !matchesPhone) return false;
                    }
                    if (departmentId != null && e.getDepartment() != null && !e.getDepartment().getId().equals(departmentId)) {
                        return false;
                    }
                    if (status != null && !status.isBlank() && !e.getStatus().equalsIgnoreCase(status)) {
                        return false;
                    }
                    return true;
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<EmployeeResponseDTO> pageContent = start <= end ? filtered.subList(start, end) : List.of();

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    @Override
    @Transactional
    public EmployeeResponseDTO uploadProfileImage(Long id, MultipartFile file) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        String imagePath = fileUploadUtil.saveFile(file);
        employee.setProfileImagePath(imagePath);
        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public EmployeeResponseDTO toggleStatus(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        employee.setStatus("ACTIVE".equalsIgnoreCase(employee.getStatus()) ? "INACTIVE" : "ACTIVE");
        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    private EmployeeResponseDTO mapToDTO(Employee employee) {
        return EmployeeResponseDTO.builder()
                .id(employee.getId())
                .employeeIdCode(employee.getEmployeeIdCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFirstName() + " " + employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .designation(employee.getDesignation())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : "Unassigned")
                .departmentCode(employee.getDepartment() != null ? employee.getDepartment().getDepartmentCode() : "N/A")
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .username(employee.getUser() != null ? employee.getUser().getUsername() : null)
                .joiningDate(employee.getJoiningDate())
                .salary(employee.getSalary())
                .status(employee.getStatus())
                .profileImagePath(employee.getProfileImagePath())
                .build();
    }
}
