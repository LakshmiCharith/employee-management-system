import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Save } from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';

export default function DepartmentFormModal({ isOpen, onClose, department, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  useEffect(() => {
    if (department) {
      setValue('departmentCode', department.departmentCode);
      setValue('name', department.name);
      setValue('description', department.description);
      setValue('headEmployeeId', department.headEmployeeId || '');
    } else {
      reset({
        departmentCode: '',
        name: '',
        description: '',
        headEmployeeId: '',
      });
    }
  }, [department, isOpen, setValue, reset]);

  const fetchEmployeesList = async () => {
    try {
      const res = await employeeService.getEmployees({ size: 100 });
      if (res.success && res.data) {
        setEmployees(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load employees for department head select', err);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (department) {
        await departmentService.update(department.id, data);
        toast.success('Department updated!');
      } else {
        await departmentService.create(data);
        toast.success('New Department created!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {department ? 'Edit Department' : 'Create Department'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department Code</label>
            <input
              type="text"
              placeholder="e.g. ENG, HR, MKT"
              disabled={!!department}
              {...register('departmentCode', { required: 'Department Code is required' })}
              className="glass-input w-full text-xs uppercase font-mono"
            />
            {errors.departmentCode && <span className="text-[11px] text-rose-400">{errors.departmentCode.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name</label>
            <input
              type="text"
              placeholder="Engineering"
              {...register('name', { required: 'Department Name is required' })}
              className="glass-input w-full text-xs"
            />
            {errors.name && <span className="text-[11px] text-rose-400">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Head of Department</label>
            <select
              {...register('headEmployeeId')}
              className="glass-input w-full text-xs bg-slate-900 text-slate-200"
            >
              <option value="">-- Select Department Head --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.designation})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Core responsibilities and goals..."
              {...register('description')}
              className="glass-input w-full text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                <><Save className="w-4 h-4" /> Save</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
