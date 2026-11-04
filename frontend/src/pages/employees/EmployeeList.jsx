import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Building2,
  MoreVertical
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
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Query & Pagination state
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [page, search, departmentId, status]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getEmployees({
        page,
        size: 8,
        search,
        departmentId: departmentId || undefined,
        status: status || undefined,
      });
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
      title: 'Are you sure?',
      text: `Do you want to remove ${emp.fullName} from the enterprise system?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete record',
      background: '#0f172a',
      color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await employeeService.deleteEmployee(emp.id);
          toast.success(`${emp.fullName} deleted successfully!`);
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

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" /> Employee Directory
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage workforce profiles, designations, and department mappings</p>
        </div>

        <button
          onClick={() => { setSelectedEmployee(null); setModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Onboard Employee
        </button>
      </div>

      {/* Filter & Search Bar Panel */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name, email, code..."
            className="glass-input w-full pl-10 text-xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={departmentId}
            onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
            className="glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="glass-input text-xs bg-slate-900 text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Employees Found</h3>
          <p className="text-xs text-slate-400 mb-4">Try adjusting your search terms or filters</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Data Table View */
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 flex-shrink-0">
                          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                            {emp.fullName[0]}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{emp.fullName}</p>
                          <span className="text-[11px] text-slate-400">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{emp.employeeIdCode}</td>
                    <td className="p-4 text-slate-300">{emp.departmentName}</td>
                    <td className="p-4 text-slate-400">{emp.designation}</td>
                    <td className="p-4 text-slate-400">{emp.joiningDate}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {emp.employeeIdCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 mb-2">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-lg font-bold text-white">
                      {emp.fullName[0]}
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm">{emp.fullName}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{emp.designation}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {emp.departmentName}</div>
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> {emp.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /> {emp.phone}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Link to={`/employees/${emp.id}`} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                  View Profile →
                </Link>
                <div className="flex gap-1">
                  <button onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }} className="p-1 text-slate-400 hover:text-amber-400"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(emp)} className="p-1 text-slate-400 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
          <span>Showing Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl glass-card disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl glass-card disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Drawer */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}
