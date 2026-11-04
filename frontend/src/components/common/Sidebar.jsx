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
  ShieldAlert,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const navItems = isAdmin
    ? [
        { label: 'Admin Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Employees', path: '/employees', icon: Users },
        { label: 'Departments', path: '/departments', icon: Building2 },
        { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { label: 'Leave Portal', path: '/leave', icon: FileText },
        { label: 'Payroll', path: '/payroll', icon: DollarSign },
        { label: 'My Account Settings', path: '/settings', icon: Settings },
      ]
    : [
        { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Clock In / Attendance', path: '/attendance', icon: CalendarCheck },
        { label: 'Apply Leave', path: '/leave', icon: FileText },
        { label: 'My Salary Slips', path: '/payroll', icon: DollarSign },
        { label: 'My Account Settings', path: '/settings', icon: Settings },
      ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } glass-panel border-r border-slate-800/80 flex flex-col justify-between`}
    >
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          {!collapsed && (
            <Logo size="sm" />
          )}

          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              N
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Info */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="glass-card p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shadow">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName || user?.username}</p>
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  {isAdmin ? (
                    <><ShieldAlert className="w-3 h-3 text-cyan-400" /> Admin</>
                  ) : (
                    <><UserCheck className="w-3 h-3 text-emerald-400" /> Employee</>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            title="Logout"
            className="w-full p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
