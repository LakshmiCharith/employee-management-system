package com.emp.ems.service;

import com.emp.ems.dto.EmployeeRequestDTO;
import com.emp.ems.dto.EmployeeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeService {
    EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO);
    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO);
    void deleteEmployee(Long id);
    EmployeeResponseDTO getEmployeeById(Long id);
    Page<EmployeeResponseDTO> getEmployees(int page, int size, String sortBy, String sortDir, String search, Long departmentId, String status);
    EmployeeResponseDTO uploadProfileImage(Long id, MultipartFile file);
    EmployeeResponseDTO toggleStatus(Long id);
}
