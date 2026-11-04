package com.emp.ems.controller;

import com.emp.ems.dto.EmployeeResponseDTO;
import com.emp.ems.service.EmployeeService;
import com.emp.ems.util.CsvExportUtil;
import com.emp.ems.util.ExcelExportUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final EmployeeService employeeService;

    @GetMapping("/export/csv")
    public void exportEmployeesToCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"employees_report.csv\"");

        Page<EmployeeResponseDTO> pageResult = employeeService.getEmployees(0, 1000, "id", "asc", null, null, null);
        List<EmployeeResponseDTO> employees = pageResult.getContent();

        CsvExportUtil.writeEmployeesToCsv(response.getWriter(), employees);
    }

    @GetMapping("/export/excel")
    public void exportEmployeesToExcel(HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"employees_report.xlsx\"");

        Page<EmployeeResponseDTO> pageResult = employeeService.getEmployees(0, 1000, "id", "asc", null, null, null);
        List<EmployeeResponseDTO> employees = pageResult.getContent();

        ExcelExportUtil.writeEmployeesToExcel(response.getOutputStream(), employees);
    }
}
