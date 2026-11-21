import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, UserCheck, Activity, Zap } from 'lucide-react';
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

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getTodayAttendance();
      if (res.success) setRecords(res.data || []);
    } catch (err) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleClockToggle = async () => {
    try {
      const data = {
        employeeId: user?.employeeId || 1,
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">// MODULE_04 :: CHRONO_SYNC</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
            <CalendarCheck className="w-6 h-6 text-cyan-400" /> TIME SYNC LOGS
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Real-time biometric time tracking and shift registry</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">LIVE FEED</span>
        </div>
      </div>

      {/* Clock Widget */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#030712] via-cyan-950/10 to-[#030712] flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ boxShadow: '0 0 30px rgba(0,245,255,0.05)' }}>
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-cyan-500/60 tracking-widest">// CHRONO_SYNC :: LOCAL_TIME</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono" style={{ textShadow: '0 0 15px rgba(0,245,255,0.5)' }}>
              {currentTime.toLocaleTimeString()}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">{currentTime.toDateString()}</p>
          </div>
        </div>
        <button
          onClick={handleClockToggle}
          className={`px-8 py-4 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3 transition-all duration-300 font-mono uppercase tracking-wider ${
            clockedIn
              ? 'bg-rose-600/80 hover:bg-rose-500 text-white border border-rose-500/40 shadow-rose-600/20'
              : 'btn-cyber-primary'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          {clockedIn ? '// CLOCK_OUT' : '// CLOCK_IN'}
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden p-6 border border-cyan-500/10">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-cyber text-cyan-300 uppercase tracking-widest">// SHIFT_REGISTRY :: TODAY</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-cyan-500/15">
                <tr>
                  {['OPERATIVE', 'DATE_STAMP', 'CLOCK_IN', 'CLOCK_OUT', 'STATUS'].map((h) => (
                    <th key={h} className="p-4 text-cyan-300 font-mono text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {(records.length ? records : [
                  { id: 1, employeeName: 'Alex Morgan', employeeCode: 'EMP-2026-002', date: '2026-07-22', checkIn: '09:00:00', checkOut: '17:30:00', status: 'PRESENT' },
                  { id: 2, employeeName: 'Sarah Jenkins', employeeCode: 'EMP-2026-001', date: '2026-07-22', checkIn: '08:45:00', checkOut: '17:15:00', status: 'PRESENT' }
                ]).map((rec) => (
                  <tr key={rec.id} className="hover:bg-cyan-500/5 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-slate-200 group-hover:text-cyan-200 transition-colors">{rec.employeeName}</p>
                      <span className="text-[10px] font-mono text-cyan-500/60">{rec.employeeCode}</span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">{rec.date}</td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">{rec.checkIn || '--:--'}</td>
                    <td className="p-4 text-rose-400 font-mono font-bold">{rec.checkOut || '--:--'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase tracking-wider">
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
