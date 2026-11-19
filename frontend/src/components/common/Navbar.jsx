import React, { useState } from 'react';
import { Search, Bell, Activity, Terminal, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ collapsed }) {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-20 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      } glass-panel border-b border-cyan-500/20 px-6 flex items-center justify-between`}
    >
      {/* Search HUD Console */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
        <input
          type="text"
          placeholder="QUERY WORKFORCE DATABASE..."
          className="glass-input font-mono w-full pl-10 pr-4 py-1.5 text-xs rounded-xl uppercase tracking-wider text-cyan-100 placeholder:text-slate-500 border border-slate-800 focus:border-cyan-400"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
          ⌘K
        </span>
      </div>

      {/* Right Cyber HUD Telemetry */}
      <div className="flex items-center gap-4">
        {/* Real-time Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">FIREBASE LIVE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-bold">LATENCY: 14ms</span>
          </div>
        </div>

        {/* Security Clearance Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold tracking-wider">
          <Shield className="w-3 h-3 text-indigo-400" />
          <span>{user?.role === 'ROLE_ADMIN' ? 'CLEARANCE: L5 ADMIN' : 'CLEARANCE: L2 STAFF'}</span>
        </div>

        {/* Notifications HUD Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all relative"
            title="System Diagnostics"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-cyan-500/30 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <h4 className="text-xs font-cyber font-bold text-white tracking-wider">DIAGNOSTICS</h4>
                </div>
                <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/20">
                  <p className="font-bold text-cyan-300 text-[11px]">// CLOUD SYNC ACTIVE</p>
                  <span className="text-[10px] text-slate-400">Firestore collections synchronized</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <p className="font-bold text-slate-300 text-[11px]">// SECURITY VERIFIED</p>
                  <span className="text-[10px] text-slate-400">Role-based access token validated</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar with Neon Ring */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800/80">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full rounded-[10px] bg-[#030712] flex items-center justify-center font-cyber text-xs font-bold text-cyan-300">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#030712]" />
          </div>
        </div>
      </div>
    </header>
  );
}
