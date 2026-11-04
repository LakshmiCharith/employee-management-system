import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  UserPlus,
  Search,
  Trash2,
  Edit2,
  Sparkles,
  CalendarCheck,
  FileText,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Send
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import EmployeeFormModal from '../employees/EmployeeFormModal';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // Shared / Admin state
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Employee role state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);
  const [applyingLeave, setApplyingLeave] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [statsRes, empRes] = await Promise.allSettled([
          api.get('/dashboard/stats'),
          employeeService.getEmployees({ page: 0, size: 50 })
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
          setStats(statsRes.value.data.data);
        }
        if (empRes.status === 'fulfilled' && empRes.value?.data) {
          setEmployees(empRes.value.data.content || []);
        }
      } else {
        // Fetch personal employee data
        const empId = user?.employeeId || 1;
        const [statsRes, leaveRes] = await Promise.allSettled([
          api.get('/dashboard/stats'),
          leaveService.getEmployeeLeaves(empId)
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
          setStats(statsRes.value.data.data);
        }
        if (leaveRes.status === 'fulfilled' && leaveRes.value?.data) {
          setMyLeaves(leaveRes.value.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (emp) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${emp.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#0f172a',
      color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await employeeService.deleteEmployee(emp.id);
          toast.success(`${emp.fullName} deleted successfully!`);
          fetchData();
        } catch (err) {
          toast.error('Failed to delete employee');
        }
      }
    });
  };

  const handleClockToggle = async () => {
    try {
      const targetEmpId = user?.employeeId || 1;
      const data = {
        employeeId: targetEmpId,
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        checkIn: !clockedIn ? new Date().toTimeString().split(' ')[0] : undefined,
        checkOut: clockedIn ? new Date().toTimeString().split(' ')[0] : undefined,
      };

      const res = await attendanceService.markAttendance(data);
      if (res.success) {
        setClockedIn(!clockedIn);
        toast.success(!clockedIn ? 'Clocked in successfully!' : 'Clocked out successfully!');
      }
    } catch (err) {
      toast.error('Failed to record attendance');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !leaveReason) {
      toast.error('Please complete all leave form fields');
      return;
    }

    setApplyingLeave(true);
    try {
      const payload = {
        employeeId: user?.employeeId || 1,
        leaveType,
        startDate,
        endDate,
        reason: leaveReason,
        status: 'PENDING',
      };

      const res = await leaveService.applyLeave(payload);
      if (res.success) {
        toast.success('Leave application submitted!');
        setStartDate('');
        setEndDate('');
        setLeaveReason('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply leave');
    } finally {
      setApplyingLeave(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      emp.fullName?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.employeeIdCode?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q)
    );
  });

  // ==========================================
  // RENDER: EMPLOYEE DASHBOARD VIEW
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="space-y-8 font-sans">
        <Toaster position="top-right" />

        {/* Employee Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <UserCheck className="w-4 h-4" /> Employee Portal • {user?.employeeCode || 'EMP-2026-001'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.fullName || user?.username}!
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Manage your daily attendance, view shift hours, and apply for leaves.
              </p>
            </div>

            {/* Live Clock & Shift Toggle Button */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Local Time</span>
                <span className="text-lg font-extrabold text-white font-mono">{currentTime.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={handleClockToggle}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all ${
                  clockedIn
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <Clock className="w-4 h-4" />
                {clockedIn ? 'Clock Out' : 'Clock In Shift'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Employee Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Shift Status</span>
              <h3 className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> {clockedIn ? 'Active On Shift' : 'Not Clocked In'}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leave Balance</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">18 Days Available</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Department</span>
              <h3 className="text-xl font-bold text-white mt-1">Engineering</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Leave Application & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Apply Leave Form */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" /> Apply for Leave
            </h3>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="glass-input w-full bg-slate-900 text-slate-200"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Reason for leave..."
                  className="glass-input w-full h-20 text-xs resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={applyingLeave}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all"
              >
                {applyingLeave ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* My Leave Requests List */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> My Leave History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Period</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(myLeaves.length ? myLeaves : [
                    { id: 1, leaveType: 'CASUAL', startDate: '2026-08-01', endDate: '2026-08-02', reason: 'Personal work', status: 'PENDING' }
                  ]).map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-slate-200">{l.leaveType}</td>
                      <td className="p-3 text-slate-300 font-mono">{l.startDate} to {l.endDate}</td>
                      <td className="p-3 text-slate-400">{l.reason}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          l.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADMIN DASHBOARD VIEW
  // ==========================================
  return (
    <div className="space-y-8 font-sans">
      <Toaster position="top-right" />

      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Admin Operations Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time workforce management, attendance tracking, leaves, and payroll control.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { setSelectedEmployee(null); setModalOpen(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" /> Add Employee
            </button>
            <Link
              to="/attendance"
              className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-emerald-400 font-semibold text-xs flex items-center gap-2 transition-all border border-emerald-500/30"
            >
              <CalendarCheck className="w-4 h-4" /> Attendance Portal
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 4 Main Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Workforce</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{employees.length || stats?.totalEmployees || 0}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active personnel
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Departments</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats?.totalDepartments || 2}</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Full operational coverage</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Attendance</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats?.todayAttendanceRate || 94.5}%</h3>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats?.todayAttendanceRate || 94.5}%` }} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Payroll</span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              ${Number(stats?.monthlyPayrollCost || 220000).toLocaleString()}
            </h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Disbursed</span>
          </div>
        </motion.div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Attendance
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Time Tracking Portal</h3>
            <p className="text-xs text-slate-400 mb-4">
              Monitor check-ins, check-outs, and shift history for all employees.
            </p>
          </div>
          <Link
            to="/attendance"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            Open Attendance Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Leaves
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Leave Management</h3>
            <p className="text-xs text-slate-400 mb-4">
              Review and approve annual, sick, and casual leave applications.
            </p>
          </div>
          <Link
            to="/leave"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            Manage Leave Requests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-pink-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                Payroll
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Payroll & Slips</h3>
            <p className="text-xs text-slate-400 mb-4">
              Disburse monthly salaries, calculate deductions, and export payslips.
            </p>
          </div>
          <Link
            to="/payroll"
            className="w-full py-2.5 px-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            Process Payroll <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Employee List Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Employee Directory
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee by name, email..."
              className="glass-input w-full pl-10 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No employees registered yet. Click <strong>Add Employee</strong> above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                          {emp.fullName ? emp.fullName[0] : 'E'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{emp.fullName}</p>
                          <span className="text-[11px] text-slate-400">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{emp.employeeIdCode}</td>
                    <td className="p-4 text-slate-300">{emp.departmentName || 'Engineering'}</td>
                    <td className="p-4 text-slate-400">{emp.designation}</td>
                    <td className="p-4 text-slate-400">{emp.joiningDate}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={fetchData}
      />
    </div>
  );
}
