import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Users, Edit2, Trash2, Shield, Zap, Cpu } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { departmentService } from '../../services/departmentService';
import DepartmentFormModal from './DepartmentFormModal';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      if (res.success) setDepartments(res.data || []);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (dept) => {
    Swal.fire({
      title: '// DECOMMISSION_SECTOR',
      text: `Permanently delete the ${dept.name} sector?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00f5ff',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'CONFIRM_DELETE',
      background: '#0f172a', color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await departmentService.delete(dept.id);
          toast.success(`${dept.name} decommissioned!`);
          fetchDepartments();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete department');
        }
      }
    });
  };

  const sectorColors = [
    { border: 'rgba(0,245,255,0.3)', glow: 'rgba(0,245,255,0.05)', text: 'text-cyan-400', bg: 'bg-cyan-500/10', borderClass: 'border-cyan-500/20' },
    { border: 'rgba(168,85,247,0.3)', glow: 'rgba(168,85,247,0.05)', text: 'text-purple-400', bg: 'bg-purple-500/10', borderClass: 'border-purple-500/20' },
    { border: 'rgba(0,255,136,0.3)', glow: 'rgba(0,255,136,0.05)', text: 'text-emerald-400', bg: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20' },
    { border: 'rgba(255,42,109,0.3)', glow: 'rgba(255,42,109,0.05)', text: 'text-pink-400', bg: 'bg-pink-500/10', borderClass: 'border-pink-500/20' },
    { border: 'rgba(251,191,36,0.3)', glow: 'rgba(251,191,36,0.05)', text: 'text-amber-400', bg: 'bg-amber-500/10', borderClass: 'border-amber-500/20' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest mb-1">// MODULE_03 :: SECTOR_DIRECTORY</p>
          <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>
            <Building2 className="w-6 h-6 text-purple-400" /> SECTOR DIRECTORY
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">Manage organizational sectors, sector leads, and headcount matrices</p>
        </div>
        <button
          onClick={() => { setSelectedDept(null); setModalOpen(true); }}
          className="btn-cyber-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> // ADD_SECTOR
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : departments.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-purple-500/10">
          <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-black font-cyber text-slate-400 mb-1 uppercase">// NO_SECTORS_FOUND</h3>
          <p className="text-xs text-slate-600 font-mono">Click ADD_SECTOR to initialize the first sector.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => {
            const col = sectorColors[idx % sectorColors.length];
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-slate-800/60 relative overflow-hidden"
                style={{ borderTopColor: col.border, borderTopWidth: 2, boxShadow: `0 0 25px ${col.glow}` }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${col.border}, transparent)` }} />

                <div>
                  {/* Code + Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono font-bold ${col.text} ${col.bg} px-2.5 py-1 rounded-full border ${col.borderClass}`}>
                      {dept.departmentCode}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedDept(dept); setModalOpen(true); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(dept)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-lg font-black font-cyber mb-1 ${col.text}`}>{dept.name}</h3>
                  <p className="text-xs text-slate-500 font-mono line-clamp-2 mb-4">{dept.description || 'No description available.'}</p>

                  {/* Sector Lead */}
                  <div className="glass-panel p-3 rounded-2xl mb-4 flex items-center gap-3 border border-slate-800/50">
                    <div className={`w-8 h-8 rounded-full ${col.bg} ${col.text} font-bold flex items-center justify-center text-xs border ${col.borderClass}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-600 block tracking-wider">// SECTOR_LEAD</span>
                      <p className="text-xs font-bold text-slate-200">{dept.headEmployeeName || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                    <Users className={`w-4 h-4 ${col.text}`} /> ACTIVE_STAFF
                  </span>
                  <span className={`text-xs font-black font-mono ${col.text} ${col.bg} px-3 py-1 rounded-full border ${col.borderClass}`}>
                    {dept.employeeCount} UNITS
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <DepartmentFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} department={selectedDept} onSuccess={fetchDepartments} />
    </div>
  );
}
