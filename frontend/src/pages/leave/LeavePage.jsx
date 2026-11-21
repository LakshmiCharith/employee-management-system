import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, CheckCircle2, XCircle, Zap } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';

export default function LeavePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState({ CASUAL: 12, SICK: 10, ANNUAL: 15 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAllLeaves();
      if (res.success) setLeaves(res.data || []);
    } catch (err) {
      toast.error('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { employeeId: user?.employeeId || 1, leaveType, startDate, endDate, reason };
      const res = await leaveService.applyLeave(data);
      if (res.success) {
        toast.success('Leave request submitted!');
        setModalOpen(false);
        fetchLeaves();
      }
    } catch (err) {
      toast.error('Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    Swal.fire({
      title: `${newStatus === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request?`,
      text: `Mark this request as ${newStatus}?`,
      icon: newStatus === 'APPROVED' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'APPROVED' ? '#10b981' : '#ef4444',
      confirmButtonText: `Yes, ${newStatus.toLowerCase()}`,
      background: '#0f172a', color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await leaveService.updateStatus(id, newStatus, null, user?.employeeId || 1);
          toast.success(`Leave request ${newStatus.toLowerCase()}`);
          fetchLeaves();
        } catch (err) {
          toast.error('Failed to update leave status');
        }
      }
    });
  };

  const balanceItems = [
    { label: 'CASUAL', days: balance.CASUAL, color: 'cyan' },
    { label: 'SICK', days: balance.SICK, color: 'amber' },
    { label: 'ANNUAL', days: balance.ANNUAL, color: 'purple' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest mb-1">// MODULE_05 :: LEAVE_QUEUE</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>
            <FileText className="w-6 h-6 text-purple-400" /> LEAVE REQUESTS QUEUE
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Submit time-off requests, check balances, and review approvals</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> // REQUEST_LEAVE
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {balanceItems.map((b) => (
          <div key={b.label} className="glass-panel p-5 rounded-2xl border border-slate-800/60"
            style={{ borderTopColor: b.color === 'cyan' ? 'rgba(0,245,255,0.3)' : b.color === 'amber' ? 'rgba(251,191,36,0.3)' : 'rgba(168,85,247,0.3)', borderTopWidth: 2 }}>
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">// {b.label}_LEAVE</span>
            <h3 className={`text-3xl font-black font-cyber mt-2 ${b.color === 'cyan' ? 'text-cyan-400' : b.color === 'amber' ? 'text-amber-400' : 'text-purple-400'}`} style={{ textShadow: `0 0 15px ${b.color === 'cyan' ? 'rgba(0,245,255,0.4)' : b.color === 'amber' ? 'rgba(251,191,36,0.4)' : 'rgba(168,85,247,0.4)'}` }}>
              {b.days}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">DAYS REMAINING</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/10">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-black font-cyber text-purple-300 uppercase tracking-widest">// LEAVE_HISTORY :: ALL_REQUESTS</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-purple-500/15">
                <tr>
                  {['OPERATIVE', 'TYPE', 'DURATION', 'REASON', 'STATUS', ...(isAdmin ? ['ACTIONS'] : [])].map((h) => (
                    <th key={h} className="p-4 text-purple-300 font-mono text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {(leaves.length ? leaves : [
                  { id: 1, employeeName: 'Sarah Jenkins', leaveType: 'CASUAL', startDate: '2026-07-25', endDate: '2026-07-26', reason: 'Family engagement', status: 'PENDING' }
                ]).map((req) => (
                  <tr key={req.id} className="hover:bg-purple-500/5 transition-colors group">
                    <td className="p-4 font-bold text-slate-200 group-hover:text-purple-200 transition-colors">{req.employeeName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20 uppercase">{req.leaveType}</span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">{req.startDate} → {req.endDate}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{req.reason}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${
                        req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                        req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/25'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right">
                        {req.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 transition-colors" title="Approve">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition-colors" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02040a]/85 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-purple-500/20"
            style={{ boxShadow: '0 0 40px rgba(168,85,247,0.1)' }}>
            <p className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest mb-1">// SUBMIT_REQUEST</p>
            <h3 className="text-base font-black font-cyber text-purple-300 mb-5 uppercase tracking-wider">Leave Application</h3>
            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// LEAVE_TYPE</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="glass-input w-full bg-[#070b18] text-slate-200 font-mono">
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Paid Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// START_DATE</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input w-full font-mono" required />
              </div>
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// END_DATE</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input w-full font-mono" required />
              </div>
              <div>
                <label className="block text-slate-400 font-mono uppercase tracking-wider mb-1">// REASON</label>
                <textarea rows="3" value={reason} onChange={(e) => setReason(e.target.value)} className="glass-input w-full resize-none font-mono" required />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-500 font-mono text-xs hover:text-slate-300 transition-colors">// CANCEL</button>
                <button type="submit" disabled={submitting} className="btn-cyber-primary px-5 py-2.5 rounded-xl font-black text-xs">
                  {submitting ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : '// SUBMIT'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
