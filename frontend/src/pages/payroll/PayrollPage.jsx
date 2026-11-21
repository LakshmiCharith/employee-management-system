import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Eye, Printer, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { payrollService } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';

export default function PayrollPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [payPeriod, setPayPeriod] = useState('2026-07');
  const [bonuses, setBonuses] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    fetchPayrolls();
    if (isAdmin) fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await payrollService.getAll()
        : await payrollService.getEmployeePayrolls(user?.employeeId || 2);
      if (res.success) setRecords(res.data || []);
    } catch (err) {
      toast.error('Failed to load payroll details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({ size: 100 });
      if (res.success) setEmployees(res.data.content || []);
    } catch (err) { console.error(err); }
  };

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { employeeId: Number(employeeId), payPeriod, bonuses: Number(bonuses), deductions: Number(deductions) };
      const res = await payrollService.generate(data);
      if (res.success) {
        toast.success('Salary Slip generated!');
        setModalOpen(false);
        fetchPayrolls();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setSubmitting(false);
    }
  };

  const mockData = [{ id: 1, employeeName: 'Alex Morgan', employeeCode: 'EMP-2026-002', payPeriod: '2026-07', basicSalary: 7916.67, bonuses: 500, deductions: 200, netSalary: 8216.67, designation: 'Senior Developer', departmentName: 'Engineering', paymentDate: '2026-07-22' }];

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-pink-400/60 uppercase tracking-widest mb-1">// MODULE_06 :: PAYROLL_LEDGER</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(255,42,109,0.4)' }}>
            <DollarSign className="w-6 h-6 text-pink-400" /> PAYROLL LEDGER
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Review payouts, generate payroll runs, and view breakdown payslips</p>
        </div>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2">
            <Plus className="w-4 h-4" /> // RUN_PAYROLL
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-panel p-6 rounded-3xl border border-pink-500/10">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-black font-cyber text-pink-300 uppercase tracking-widest">// SALARY_HISTORY :: ALL_CYCLES</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-pink-500/15">
                <tr>
                  {['OPERATIVE', 'PERIOD', 'GROSS_BASIC', 'BONUSES', 'DEDUCTIONS', 'NET_PAYOUT', 'SLIP'].map((h) => (
                    <th key={h} className="p-4 text-pink-300 font-mono text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {(records.length ? records : mockData).map((rec) => (
                  <tr key={rec.id} className="hover:bg-pink-500/5 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-slate-200 group-hover:text-pink-200 transition-colors">{rec.employeeName}</p>
                      <span className="text-[10px] text-pink-400/70 font-mono">{rec.employeeCode}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{rec.payPeriod}</td>
                    <td className="p-4 text-slate-300 font-mono">${Number(rec.basicSalary).toLocaleString()}</td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">+${Number(rec.bonuses).toLocaleString()}</td>
                    <td className="p-4 text-rose-400 font-mono font-bold">-${Number(rec.deductions).toLocaleString()}</td>
                    <td className="p-4 text-white font-mono font-black" style={{ textShadow: '0 0 10px rgba(0,245,255,0.4)' }}>
                      ${Number(rec.netSalary).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelectedSlip(rec)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors" title="View Slip">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Run Payroll Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02040a]/85 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-pink-500/20"
            style={{ boxShadow: '0 0 40px rgba(255,42,109,0.08)' }}>
            <p className="text-[10px] font-mono text-pink-400/60 uppercase tracking-widest mb-1">// GENERATE_SLIP</p>
            <h3 className="text-base font-black font-cyber text-pink-300 mb-5 uppercase tracking-wider">Run Monthly Payroll</h3>
            <form onSubmit={handleGeneratePayroll} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// SELECT_OPERATIVE</label>
                <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="glass-input w-full bg-[#070b18] text-slate-200 font-mono" required>
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeIdCode})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// PAY_PERIOD (YYYY-MM)</label>
                <input type="text" placeholder="2026-07" value={payPeriod} onChange={(e) => setPayPeriod(e.target.value)} className="glass-input w-full font-mono" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// BONUSES ($)</label>
                  <input type="number" value={bonuses} onChange={(e) => setBonuses(e.target.value)} className="glass-input w-full font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// DEDUCTIONS ($)</label>
                  <input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="glass-input w-full font-mono" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-500 font-mono text-xs hover:text-slate-300 transition-colors">// CANCEL</button>
                <button type="submit" disabled={submitting} className="btn-cyber-primary px-5 py-2.5 rounded-xl font-black text-xs">
                  {submitting ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : '// GENERATE'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02040a]/85 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-xl rounded-3xl p-8 relative shadow-2xl border border-cyan-500/20 space-y-6"
            style={{ boxShadow: '0 0 40px rgba(0,245,255,0.07)' }}>
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-4">
              <div>
                <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">// PAYSLIP_DOCUMENT</p>
                <h2 className="text-lg font-black font-cyber text-cyan-300 uppercase tracking-wider">Salary Slip</h2>
                <span className="text-[10px] text-slate-500 font-mono">PERIOD: {selectedSlip.payPeriod}</span>
              </div>
              <button onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 text-xs font-mono border border-slate-700">
                <Printer className="w-4 h-4" /> PRINT
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-mono uppercase tracking-wider text-[10px] block">// OPERATIVE_DETAILS</span>
                <p className="font-bold text-slate-200 mt-1">{selectedSlip.employeeName}</p>
                <p className="text-slate-400">{selectedSlip.designation}</p>
                <p className="text-[10px] font-mono text-cyan-400/70 mt-0.5">{selectedSlip.employeeCode}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-mono uppercase tracking-wider text-[10px] block">// COMPANY_NODE</span>
                <p className="font-bold text-slate-200 mt-1">NEXUS EMS Corp</p>
                <p className="text-slate-400">100 Quantum Blvd, SF</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-2 text-xs border border-cyan-500/10">
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 mb-2">
                <span className="font-mono text-cyan-300 text-[10px] uppercase tracking-wider">EARNING_DESCRIPTION</span>
                <span className="font-mono text-cyan-300 text-[10px] uppercase tracking-wider">AMOUNT_USD</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-mono">Basic Gross Earning</span>
                <span className="font-mono">${Number(selectedSlip.basicSalary).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="font-mono">+ Performance Bonuses</span>
                <span className="font-mono">+${Number(selectedSlip.bonuses).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-rose-400 border-b border-slate-800 pb-2 mb-2">
                <span className="font-mono">- Tax & Insurance Deductions</span>
                <span className="font-mono">-${Number(selectedSlip.deductions).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-black text-sm pt-1">
                <span className="font-cyber text-white uppercase tracking-widest">NET CREDITED PAYOUT</span>
                <span className="font-mono text-cyan-400" style={{ textShadow: '0 0 10px rgba(0,245,255,0.5)' }}>
                  ${Number(selectedSlip.netSalary).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedSlip(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono border border-slate-700 transition-colors">
                // CLOSE_SLIP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
