import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Users, UserCheck, Edit2, Trash2, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { departmentService } from '../../services/departmentService';
import DepartmentFormModal from './DepartmentFormModal';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      if (res.success) {
        setDepartments(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (dept) => {
    Swal.fire({
      title: 'Delete Department?',
      text: `Are you sure you want to delete ${dept.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete department',
      background: '#0f172a',
      color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await departmentService.delete(dept.id);
          toast.success(`${dept.name} deleted!`);
          fetchDepartments();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete department');
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
            <Building2 className="w-6 h-6 text-purple-400" /> Departments Directory
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage organizational units, department heads, and headcount metrics</p>
        </div>

        <button
          onClick={() => { setSelectedDept(null); setModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : departments.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Departments Found</h3>
          <p className="text-xs text-slate-400">Click "Add Department" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between"
            >
              <div>
                {/* Header Code & Actions */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {dept.departmentCode}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedDept(dept); setModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{dept.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{dept.description || 'No description available.'}</p>

                {/* Head of Dept Box */}
                <div className="glass-panel p-3 rounded-2xl mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs border border-purple-500/30">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Department Head</span>
                    <p className="text-xs font-bold text-slate-200">{dept.headEmployeeName}</p>
                  </div>
                </div>
              </div>

              {/* Headcount Stat Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" /> Active Staff
                </span>
                <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {dept.employeeCount} Members
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <DepartmentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        department={selectedDept}
        onSuccess={fetchDepartments}
      />
    </div>
  );
}
