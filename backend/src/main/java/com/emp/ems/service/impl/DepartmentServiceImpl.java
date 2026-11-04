package com.emp.ems.service.impl;

import com.emp.ems.dto.DepartmentDTO;
import com.emp.ems.entity.Department;
import com.emp.ems.entity.Employee;
import com.emp.ems.exception.BadRequestException;
import com.emp.ems.exception.ResourceNotFoundException;
import com.emp.ems.repository.DepartmentRepository;
import com.emp.ems.repository.EmployeeRepository;
import com.emp.ems.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {
            throw new BadRequestException("Department code already exists: " + dto.getDepartmentCode());
        }

        Employee headEmp = null;
        if (dto.getHeadEmployeeId() != null) {
            headEmp = employeeRepository.findById(dto.getHeadEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Head employee not found with ID: " + dto.getHeadEmployeeId()));
        }

        Department dept = Department.builder()
                .departmentCode(dto.getDepartmentCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .headEmployee(headEmp)
                .build();

        Department saved = departmentRepository.save(dept);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        Employee headEmp = null;
        if (dto.getHeadEmployeeId() != null) {
            headEmp = employeeRepository.findById(dto.getHeadEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Head employee not found with ID: " + dto.getHeadEmployeeId()));
        }

        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        dept.setHeadEmployee(headEmp);

        Department updated = departmentRepository.save(dept);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        departmentRepository.delete(dept);
    }

    @Override
    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToDTO(dept);
    }

    @Override
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private DepartmentDTO mapToDTO(Department dept) {
        long empCount = employeeRepository.findAll().stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(dept.getId()))
                .count();

        return DepartmentDTO.builder()
                .id(dept.getId())
                .departmentCode(dept.getDepartmentCode())
                .name(dept.getName())
                .description(dept.getDescription())
                .headEmployeeId(dept.getHeadEmployee() != null ? dept.getHeadEmployee().getId() : null)
                .headEmployeeName(dept.getHeadEmployee() != null ? dept.getHeadEmployee().getFirstName() + " " + dept.getHeadEmployee().getLastName() : "Not Assigned")
                .headEmployeeEmail(dept.getHeadEmployee() != null ? dept.getHeadEmployee().getEmail() : null)
                .employeeCount(empCount)
                .build();
    }
}
