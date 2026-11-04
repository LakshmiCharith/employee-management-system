import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, CheckCircle2, XCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
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

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAllLeaves();
      if (res.success) {
        setLeaves(res.data || []);
      }
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
      const data = {
        employeeId: user?.employeeId || 1,
        leaveType,
        startDate,
        endDate,
        reason,
      };
      const res = await leaveService.applyLeave(data);
      if (res.success) {
        toast.success('Leave request submitted successfully!');
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
      text: `Are you sure you want to mark this request as ${newStatus}?`,
      icon: newStatus === 'APPROVED' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'APPROVED' ? '#10b981' : '#ef4444',
      confirmButtonText: `Yes, ${newStatus.toLowerCase()}`,
      background: '#0f172a',
      color: '#f8fafc',
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

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-pink-400" /> Leave Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">Submit time-off requests, check balances, and review approvals</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Apply For Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs uppercase font-bold text-slate-400">Casual Leave</span>
          <h3 className="text-2xl font-extrabold text-white mt-2">{balance.CASUAL} Days Remaining</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs uppercase font-bold text-slate-400">Sick Leave</span>
          <h3 className="text-2xl font-extrabold text-amber-400 mt-2">{balance.SICK} Days Remaining</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs uppercase font-bold text-slate-400">Annual Paid Leave</span>
          <h3 className="text-2xl font-extrabold text-indigo-400 mt-2">{balance.ANNUAL} Days Remaining</h3>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-base font-bold text-white mb-4">Leave Requests History</h3>

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
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  {isAdmin && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(leaves.length ? leaves : [
                  { id: 1, employeeName: 'Sarah Jenkins', leaveType: 'CASUAL', startDate: '2026-07-25', endDate: '2026-07-26', reason: 'Family engagement', status: 'PENDING' }
                ]).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{req.employeeName}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-indigo-300 font-bold">{req.leaveType}</span></td>
                    <td className="p-4 text-slate-400 font-mono">{req.startDate} → {req.endDate}</td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{req.reason}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right">
                        {req.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              title="Reject"
                            >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Submit Leave Request</h3>
            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="glass-input w-full bg-slate-900 text-slate-200">
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Paid Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input w-full" required />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input w-full" required />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason</label>
                <textarea rows="3" value={reason} onChange={(e) => setReason(e.target.value)} className="glass-input w-full resize-none" required />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
