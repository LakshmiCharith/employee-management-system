import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Save } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EmployeeFormModal({ isOpen, onClose, employee, onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employee) {
      setValue('firstName', employee.firstName);
      setValue('lastName', employee.lastName);
      setValue('email', employee.email);
      setValue('phone', employee.phone);
      setValue('designation', employee.designation);
      setValue('departmentId', employee.departmentId);
      setValue('joiningDate', employee.joiningDate);
      setValue('salary', employee.salary);
      setValue('status', employee.status || 'ACTIVE');
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        departmentId: '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 75000,
        status: 'ACTIVE',
      });
    }
  }, [employee, isOpen, setValue, reset]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments list', err);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (employee) {
        await employeeService.updateEmployee(employee.id, data);
        toast.success('Employee details updated successfully!');
      } else {
        await employeeService.createEmployee(data);
        toast.success('New employee onboarded successfully!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {employee ? 'Edit Employee Details' : 'Onboard New Employee'}
              </h3>
              <p className="text-xs text-slate-400">Fill in employee professional profile information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="glass-input w-full text-sm"
              />
              {errors.firstName && <span className="text-[11px] text-rose-400">{errors.firstName.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="glass-input w-full text-sm"
              />
              {errors.lastName && <span className="text-[11px] text-rose-400">{errors.lastName.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="glass-input w-full text-sm"
              />
              {errors.email && <span className="text-[11px] text-rose-400">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone', { required: 'Phone is required' })}
                className="glass-input w-full text-sm"
              />
              {errors.phone && <span className="text-[11px] text-rose-400">{errors.phone.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Title</label>
              <input
                type="text"
                {...register('designation', { required: 'Designation is required' })}
                className="glass-input w-full text-sm"
              />
              {errors.designation && <span className="text-[11px] text-rose-400">{errors.designation.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                {...register('departmentId', { required: 'Department is required' })}
                className="glass-input w-full text-sm bg-slate-900 text-slate-200"
              >
                <option value="">Select Department</option>
                {(departments.length ? departments : [
                  { id: 1, name: 'Engineering' },
                  { id: 2, name: 'Human Resources' }
                ]).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.departmentId && <span className="text-[11px] text-rose-400">{errors.departmentId.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Joining Date</label>
              <input
                type="date"
                {...register('joiningDate', { required: 'Joining date is required' })}
                className="glass-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Basic Salary ($)</label>
              <input
                type="number"
                {...register('salary', { required: 'Salary is required' })}
                className="glass-input w-full text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                <><Save className="w-4 h-4" /> Save Employee</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
