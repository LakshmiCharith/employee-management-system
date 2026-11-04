package com.emp.ems.repository;

import com.emp.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeIdCode(String code);
    Optional<Employee> findByUserId(Long userId);
    Boolean existsByEmail(String email);
    Boolean existsByEmployeeIdCode(String code);
}
