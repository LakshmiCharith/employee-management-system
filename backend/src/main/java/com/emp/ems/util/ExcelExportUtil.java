package com.emp.ems.util;

import com.emp.ems.dto.EmployeeResponseDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class ExcelExportUtil {

    public static void writeEmployeesToExcel(OutputStream outputStream, List<EmployeeResponseDTO> employees) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Employees Directory");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Employee ID", "Full Name", "Email", "Phone", "Department", "Designation", "Joining Date", "Salary ($)", "Status"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Create Data Rows
            int rowNum = 1;
            for (EmployeeResponseDTO emp : employees) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(emp.getEmployeeIdCode());
                row.createCell(1).setCellValue(emp.getFullName());
                row.createCell(2).setCellValue(emp.getEmail());
                row.createCell(3).setCellValue(emp.getPhone());
                row.createCell(4).setCellValue(emp.getDepartmentName());
                row.createCell(5).setCellValue(emp.getDesignation());
                row.createCell(6).setCellValue(emp.getJoiningDate().toString());
                row.createCell(7).setCellValue(emp.getSalary().doubleValue());
                row.createCell(8).setCellValue(emp.getStatus());
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
        }
    }
}
