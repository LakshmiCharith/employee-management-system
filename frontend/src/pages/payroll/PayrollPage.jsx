import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Eye, Calendar, Printer, FileText } from 'lucide-react';
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

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [payPeriod, setPayPeriod] = useState('2026-07');
  const [bonuses, setBonuses] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // View Slip State
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
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load payroll details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({ size: 100 });
      if (res.success) {
        setEmployees(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        employeeId: Number(employeeId),
        payPeriod,
        bonuses: Number(bonuses),
        deductions: Number(deductions),
      };
      const res = await payrollService.generate(data);
      if (res.success) {
        toast.success('Salary Slip generated successfully!');
        setModalOpen(false);
        fetchPayrolls();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-indigo-400" /> Payroll & Compensations
          </h1>
          <p className="text-slate-400 text-xs mt-1">Review payouts, generate payroll runs, and view breakdown payslips</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Run Payroll
          </button>
        )}
      </div>

      {/* Processed Slips Table */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-base font-bold text-white mb-4">Disbursed Salary History</h3>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Gross Basic</th>
                  <th className="p-4">Bonuses</th>
                  <th className="p-4">Deductions</th>
                  <th className="p-4">Net Payout</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(records.length ? records : [
                  { id: 1, employeeName: 'Alex Morgan', employeeCode: 'EMP-2026-002', payPeriod: '2026-07', basicSalary: 7916.67, bonuses: 500, deductions: 200, netSalary: 8216.67, designation: 'Senior Developer', departmentName: 'Engineering', paymentDate: '2026-07-22' }
                ]).map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-200">
                      <p>{rec.employeeName}</p>
                      <span className="text-[10px] text-indigo-400 font-mono">{rec.employeeCode}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{rec.payPeriod}</td>
                    <td className="p-4 text-slate-300 font-mono">${Number(rec.basicSalary).toLocaleString()}</td>
                    <td className="p-4 text-emerald-400 font-mono">+${Number(rec.bonuses).toLocaleString()}</td>
                    <td className="p-4 text-rose-400 font-mono">-${Number(rec.deductions).toLocaleString()}</td>
                    <td className="p-4 text-white font-mono font-bold">${Number(rec.netSalary).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSlip(rec)}
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400"
                        title="View Slip"
                      >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Run Monthly Payroll</h3>
            <form onSubmit={handleGeneratePayroll} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Employee</label>
                <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="glass-input w-full bg-slate-900 text-slate-200" required>
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeIdCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pay Period (YYYY-MM)</label>
                <input type="text" placeholder="2026-07" value={payPeriod} onChange={(e) => setPayPeriod(e.target.value)} className="glass-input w-full font-mono" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bonuses ($)</label>
                  <input type="number" value={bonuses} onChange={(e) => setBonuses(e.target.value)} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deductions ($)</label>
                  <input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="glass-input w-full" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Generate Slip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Slip Invoice Overlay Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-8 relative shadow-2xl border border-slate-800 space-y-6">
            {/* Payslip Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Salary Slip (Payslip)</h2>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Disbursed Period: {selectedSlip.payPeriod}</span>
              </div>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>

            {/* Profile Meta Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Employee Details</span>
                <p className="font-bold text-slate-200 mt-1">{selectedSlip.employeeName}</p>
                <p className="text-slate-400">{selectedSlip.designation}</p>
                <p className="text-[10px] font-mono text-indigo-400 mt-0.5">{selectedSlip.employeeCode}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">Company Address</span>
                <p className="font-bold text-slate-200 mt-1">Enterprise EMS Corp</p>
                <p className="text-slate-400">100 Tech Venture Way, SF</p>
              </div>
            </div>

            {/* Line Items Calculations */}
            <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-bold text-slate-400">
                <span>Earning Description</span>
                <span>Amount ($)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Basic Gross Earning</span>
                <span className="font-mono">${Number(selectedSlip.basicSalary).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Add: Performance Bonuses</span>
                <span className="font-mono">+${Number(selectedSlip.bonuses).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-rose-400 border-b border-slate-800 pb-2 mb-2">
                <span>Less: Tax & Insurance Deductions</span>
                <span className="font-mono">-${Number(selectedSlip.deductions).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-white text-sm pt-2">
                <span>Net Credited Payout</span>
                <span className="font-mono text-indigo-400">${Number(selectedSlip.netSalary).toLocaleString()}</span>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSlip(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
