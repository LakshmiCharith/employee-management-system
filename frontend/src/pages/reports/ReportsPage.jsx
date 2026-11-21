import React, { useState } from 'react';
import { FileBarChart2, FileText, Download, FileSpreadsheet, Sparkles, Database, Zap } from 'lucide-react';
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
      link.download = 'nexus_ems_personnel_report.csv';
      link.click();
      toast.success('CSV data packet exported!');
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
      link.download = 'nexus_ems_personnel_report.xlsx';
      link.click();
      toast.success('Excel workbook exported!');
    } catch (err) {
      toast.error('Failed to export Excel report');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">// MODULE_07 :: DATA_EXPORT</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
            <FileBarChart2 className="w-6 h-6 text-cyan-400" /> DATA EXPORT MODULE
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Download encrypted data packets and corporate directory worksheets</p>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Card */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-cyan-500/15 relative overflow-hidden"
          style={{ boxShadow: '0 0 25px rgba(0,245,255,0.04)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-mono text-cyan-500/60 tracking-widest">// ASCII_PLAINTEXT</span>
          </div>
          <div>
            <h3 className="text-lg font-black font-cyber text-white">CSV Data Packet (.csv)</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">
              Lightweight plaintext matrix ideal for scripting, analytical imports, and pipeline backups.
            </p>
          </div>
          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv}
            className="btn-cyber-primary w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloadingCsv ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
              <><Download className="w-4 h-4" /> // DOWNLOAD_CSV</>
            )}
          </button>
        </div>

        {/* Excel Card */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-emerald-500/15 relative overflow-hidden"
          style={{ boxShadow: '0 0 25px rgba(0,255,136,0.04)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-mono text-emerald-500/60 tracking-widest">// SPREADSHEET_MATRIX</span>
          </div>
          <div>
            <h3 className="text-lg font-black font-cyber text-white">Excel Workbook (.xlsx)</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">
              Rich-formatted spreadsheet with highlighted headers and auto-columns ready for Excel or Sheets.
            </p>
          </div>
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-black text-xs flex items-center justify-center gap-2 border border-emerald-500/25 transition-all font-mono uppercase tracking-wider disabled:opacity-50"
            style={{ boxShadow: downloadingExcel ? 'none' : '0 0 15px rgba(0,255,136,0.1)' }}
          >
            {downloadingExcel ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
              <><Download className="w-4 h-4" /> // DOWNLOAD_XLSX</>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/10 bg-gradient-to-r from-[#030712] via-purple-950/10 to-[#030712]">
        <div className="flex items-center gap-2 mb-5">
          <Database className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-black font-cyber text-purple-300 uppercase tracking-widest">// EXPORT_SUMMARY :: LIVE_SNAPSHOT</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {[
            { label: 'TOTAL_STAFF', value: '24 Profiles', color: 'text-cyan-400' },
            { label: 'AVG_TENURE', value: '2.4 Years', color: 'text-slate-200' },
            { label: 'MONTHLY_BURN', value: '$220K / mo', color: 'text-purple-400' },
            { label: 'AUDIT_STATUS', value: 'COMPLIANT', color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label}>
              <span className="text-slate-600 block font-mono uppercase tracking-wider text-[10px]">// {s.label}</span>
              <p className={`text-base font-black font-cyber mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
