package com.emp.ems.repository;

import com.emp.ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCode(String code);
    Optional<Department> findByName(String name);
    Boolean existsByDepartmentCode(String code);
    Boolean existsByName(String name);
}
