import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  FileText,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Terminal,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const navItems = isAdmin
    ? [
        { label: 'Admin Deck', path: '/dashboard', icon: LayoutDashboard, tag: 'CORE' },
        { label: 'Personnel', path: '/employees', icon: Users, tag: 'DIR' },
        { label: 'Departments', path: '/departments', icon: Building2, tag: 'ORG' },
        { label: 'Time & Shifts', path: '/attendance', icon: CalendarCheck, tag: 'SYNC' },
        { label: 'Leave Portal', path: '/leave', icon: FileText, tag: 'REQ' },
        { label: 'Payroll & Slips', path: '/payroll', icon: DollarSign, tag: 'LEDGER' },
        { label: 'Terminal Config', path: '/settings', icon: Settings, tag: 'SYS' },
      ]
    : [
        { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard, tag: 'CORE' },
        { label: 'Shift Clock In', path: '/attendance', icon: CalendarCheck, tag: 'SYNC' },
        { label: 'Apply Leave', path: '/leave', icon: FileText, tag: 'REQ' },
        { label: 'Salary Slips', path: '/payroll', icon: DollarSign, tag: 'LEDGER' },
        { label: 'Terminal Config', path: '/settings', icon: Settings, tag: 'SYS' },
      ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } glass-panel border-r border-cyan-500/20 flex flex-col justify-between`}
    >
      <div>
        {/* Header Branding */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-cyan-500/15">
          {!collapsed && <Logo size="sm" />}

          {collapsed && (
            <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-cyber font-black text-xs shadow-lg shadow-cyan-500/30">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all border border-transparent hover:border-cyan-500/30"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400/70 uppercase">
              // COMMAND MODULES
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all group relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-800 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isActive
                            ? 'text-cyan-300 border-cyan-500/40 bg-cyan-500/20'
                            : 'text-slate-600 border-slate-800 group-hover:text-slate-400'
                        }`}>
                          {item.tag}
                        </span>
                      </div>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_12px_#22d3ee]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Logout */}
      <div className="p-3 border-t border-cyan-500/15 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-200 truncate">{user?.fullName || user?.username}</p>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block">
                {user?.role === 'ROLE_ADMIN' ? 'SYS_ADMIN' : 'STAFF'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 text-xs font-semibold transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
}
