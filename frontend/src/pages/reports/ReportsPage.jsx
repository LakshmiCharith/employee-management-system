import React, { useState } from 'react';
import { FileBarChart2, FileText, Download, Table, FileSpreadsheet, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportsPage() {
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      const response = await api.get('/reports/export/csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'employees_directory_report.csv';
      link.click();
      toast.success('CSV Report exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV report');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const response = await api.get('/reports/export/excel', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'employees_directory_report.xlsx';
      link.click();
      toast.success('Excel Workbook exported successfully!');
    } catch (err) {
      toast.error('Failed to export Excel report');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileBarChart2 className="w-6 h-6 text-indigo-400" /> Export Center & Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1">Download secure worksheets and tabular files of corporate directories</p>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500">ASCII Plaintext</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Comma Separated Values (.csv)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Standard light-weight plaintext sheet ideal for scripting, analytical imports, or database backups.
            </p>
          </div>
          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            {downloadingCsv ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
              <><Download className="w-4 h-4" /> Download CSV Document</>
            )}
          </button>
        </div>

        {/* Excel Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Spreadsheet Workbook</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Microsoft Excel Workbook (.xlsx)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Rich spreadsheet formatting with highlighted headers and auto-adjusted columns ready for Excel or Google Sheets.
            </p>
          </div>
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/15 transition-all"
          >
            {downloadingExcel ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : (
              <><Download className="w-4 h-4" /> Download Excel Workbook</>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Insights Placeholder */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/10">
        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> Export Summary Preview</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block font-bold">Total Staff Count</span>
            <p className="text-base font-bold text-slate-200 mt-1">24 Active Profiles</p>
          </div>
          <div>
            <span className="text-slate-500 block font-bold">Average Tenure</span>
            <p className="text-base font-bold text-slate-200 mt-1">2.4 Years</p>
          </div>
          <div>
            <span className="text-slate-500 block font-bold">Monthly Run Rate</span>
            <p className="text-base font-bold text-indigo-400 mt-1">$220,000 / mo</p>
          </div>
          <div>
            <span className="text-slate-500 block font-bold">Auditing Status</span>
            <p className="text-base font-bold text-emerald-400 mt-1">Compliant (SAIF)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
