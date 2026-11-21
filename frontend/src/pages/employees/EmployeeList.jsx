import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Search, Plus, LayoutGrid, List as ListIcon,
  Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  Phone, Mail, Building2, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';
import EmployeeFormModal from './EmployeeFormModal';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { fetchEmployees(); }, [page, search, departmentId, status]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) setDepartments(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getEmployees({ page, size: 8, search, departmentId: departmentId || undefined, status: status || undefined });
      if (res.success && res.data) {
        setEmployees(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (emp) => {
    Swal.fire({
      title: '// CONFIRM_DECOMMISSION',
      text: `Permanently remove ${emp.fullName} from the NEXUS system?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00f5ff',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'CONFIRM_DELETE',
      background: '#0f172a', color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await employeeService.deleteEmployee(emp.id);
          toast.success(`${emp.fullName} decommissioned!`);
          fetchEmployees();
        } catch (err) {
          toast.error('Failed to delete employee');
        }
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">// MODULE_02 :: PERSONNEL_REGISTRY</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
            <Users className="w-6 h-6 text-cyan-400" /> PERSONNEL REGISTRY
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Manage workforce profiles, designations, and sector mappings</p>
        </div>
        <button
          onClick={() => { setSelectedEmployee(null); setModalOpen(true); }}
          className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> // ONBOARD_OPERATIVE
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-cyan-500/10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="// SEARCH :: name, email, code..."
            className="glass-input w-full pl-10 text-xs font-mono"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }} className="glass-input text-xs bg-[#070b18] text-slate-300 font-mono">
            <option value="">ALL_SECTORS</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="glass-input text-xs bg-[#070b18] text-slate-300 font-mono">
            <option value="">ALL_STATUS</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <div className="flex bg-[#070b18] p-1 rounded-xl border border-cyan-500/15">
            <button onClick={() => setViewMode('table')} title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <ListIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-cyan-500/10">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black font-cyber text-slate-400 mb-1 uppercase">// NO_OPERATIVES_FOUND</h3>
          <p className="text-xs text-slate-600 font-mono">Adjust your query parameters or onboard new personnel</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-3xl overflow-hidden border border-cyan-500/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-cyan-500/15">
                <tr>
                  {['OPERATIVE', 'UID_CODE', 'SECTOR', 'DESIGNATION', 'JOIN_DATE', 'STATUS', 'ACTIONS'].map((h) => (
                    <th key={h} className="p-4 text-cyan-300 font-mono text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-cyan-500/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-xs font-black text-cyan-300 flex-shrink-0">
                          {emp.fullName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-cyan-200 transition-colors">{emp.fullName}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-cyan-500/70 text-[10px]">{emp.employeeIdCode}</td>
                    <td className="p-4 text-slate-400 font-mono">{emp.departmentName}</td>
                    <td className="p-4 text-slate-500 font-mono">{emp.designation}</td>
                    <td className="p-4 text-slate-500 font-mono">{emp.joiningDate}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/employees/${emp.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {employees.map((emp) => (
            <motion.div key={emp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-cyan-500/10 hover:border-cyan-500/25 transition-all"
              style={{ boxShadow: '0 0 20px rgba(0,245,255,0.03)' }}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-cyan-500/60 bg-cyan-500/5 border border-cyan-500/15 px-2 py-0.5 rounded">
                    {emp.employeeIdCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>{emp.status}</span>
                </div>
                <div className="text-center mb-4">
                  <div className="w-14 h-14 mx-auto rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-xl font-black text-cyan-300 mb-2">
                    {emp.fullName[0]}
                  </div>
                  <h4 className="font-black text-white text-sm">{emp.fullName}</h4>
                  <p className="text-xs text-cyan-400/70 font-mono">{emp.designation}</p>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-3 border-t border-cyan-500/10">
                  <div className="flex items-center gap-2 font-mono"><Building2 className="w-3.5 h-3.5 text-cyan-500/40" /> {emp.departmentName}</div>
                  <div className="flex items-center gap-2 font-mono"><Mail className="w-3.5 h-3.5 text-cyan-500/40" /> {emp.email}</div>
                  <div className="flex items-center gap-2 font-mono"><Phone className="w-3.5 h-3.5 text-cyan-500/40" /> {emp.phone}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-cyan-500/10">
                <Link to={`/employees/${emp.id}`} className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold transition-colors">
                  VIEW_PROFILE →
                </Link>
                <div className="flex gap-1">
                  <button onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }} className="p-1 text-slate-500 hover:text-amber-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(emp)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-slate-500 font-mono">
          <span>// PAGE {page + 1} OF {totalPages}</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl glass-panel border border-cyan-500/15 disabled:opacity-30 hover:border-cyan-500/30 transition-colors">
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
            </button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl glass-panel border border-cyan-500/15 disabled:opacity-30 hover:border-cyan-500/30 transition-colors">
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      <EmployeeFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} employee={selectedEmployee} onSuccess={fetchEmployees} />
    </div>
  );
}
