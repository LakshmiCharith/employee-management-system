package com.emp.ems.util;

import com.emp.ems.dto.EmployeeResponseDTO;
import com.opencsv.CSVWriter;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

public class CsvExportUtil {

    public static void writeEmployeesToCsv(Writer writer, List<EmployeeResponseDTO> employees) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            // Header row
            String[] header = {"Employee ID", "Full Name", "Email", "Phone", "Department", "Designation", "Joining Date", "Salary ($)", "Status"};
            csvWriter.writeNext(header);

            // Data rows
            for (EmployeeResponseDTO emp : employees) {
                String[] data = {
                        emp.getEmployeeIdCode(),
                        emp.getFullName(),
                        emp.getEmail(),
                        emp.getPhone(),
                        emp.getDepartmentName(),
                        emp.getDesignation(),
                        emp.getJoiningDate().toString(),
                        emp.getSalary().toString(),
                        emp.getStatus()
                };
                csvWriter.writeNext(data);
            }
        }
    }
}
