package com.emp.ems.repository;

import com.emp.ems.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployeeIdOrderByPayPeriodDesc(Long employeeId);
    Optional<Payroll> findByEmployeeIdAndPayPeriod(Long employeeId, String payPeriod);
    List<Payroll> findByPayPeriod(String payPeriod);

    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.paymentStatus = 'PAID'")
    BigDecimal calculateTotalPaidPayroll();
}
