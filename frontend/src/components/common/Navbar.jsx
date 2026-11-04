import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ collapsed }) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-20 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      } glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between`}
    >
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search workforce, departments..."
          className="glass-input w-full pl-10 pr-4 py-1.5 text-xs rounded-full bg-[#070a12]"
        />
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center gap-4">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Status: <strong className="text-emerald-400 font-bold">Operational</strong></span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-800 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">System Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="font-bold text-slate-200">System Notification</p>
                  <span className="text-[10px] text-slate-400">Database connected & operational</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5">
            <div className="w-full h-full rounded-full bg-[#070a12] flex items-center justify-center text-xs font-bold text-cyan-300">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
