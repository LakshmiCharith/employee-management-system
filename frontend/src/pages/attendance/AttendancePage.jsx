import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, CheckCircle2, AlertCircle, Calendar, UserCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';

export default function AttendancePage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getTodayAttendance();
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
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
        fetchAttendance();
      }
    } catch (err) {
      toast.error('Failed to record attendance');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-emerald-400" /> Attendance Portal
          </h1>
          <p className="text-slate-400 text-xs mt-1">Real-time time tracking, daily logs, and clock-in history</p>
        </div>
      </div>

      {/* Live Digital Clock & Clock-In Widget */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Current Local Time</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              {currentTime.toLocaleTimeString()}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{currentTime.toDateString()}</p>
          </div>
        </div>

        <button
          onClick={handleClockToggle}
          className={`px-8 py-4 rounded-2xl text-sm font-extrabold shadow-xl flex items-center gap-3 transition-all duration-300 ${
            clockedIn
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          {clockedIn ? 'Clock Out Shift' : 'Clock In Shift'}
        </button>
      </div>

      {/* Attendance History Table */}
      <div className="glass-panel rounded-3xl overflow-hidden p-6">
        <h3 className="text-base font-bold text-white mb-4">Today's Attendance Logs</h3>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Clock In</th>
                  <th className="p-4">Clock Out</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(records.length ? records : [
                  { id: 1, employeeName: 'Alex Morgan', employeeCode: 'EMP-2026-002', date: '2026-07-22', checkIn: '09:00:00', checkOut: '17:30:00', status: 'PRESENT' },
                  { id: 2, employeeName: 'Sarah Jenkins', employeeCode: 'EMP-2026-001', date: '2026-07-22', checkIn: '08:45:00', checkOut: '17:15:00', status: 'PRESENT' }
                ]).map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">
                      <div>
                        <p className="font-bold text-slate-200">{rec.employeeName}</p>
                        <span className="text-[10px] font-mono text-indigo-400">{rec.employeeCode}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{rec.date}</td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">{rec.checkIn || '--:--'}</td>
                    <td className="p-4 text-rose-400 font-mono font-bold">{rec.checkOut || '--:--'}</td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
