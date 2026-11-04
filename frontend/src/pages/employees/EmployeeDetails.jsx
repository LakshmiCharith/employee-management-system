import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Camera,
  ShieldAlert,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import toast, { Toaster } from 'react-hot-toast';

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await employeeService.getEmployeeById(id);
      if (res.success) {
        setEmployee(res.data);
      }
    } catch (err) {
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await employeeService.uploadImage(id, file);
      if (res.success) {
        toast.success('Profile avatar updated!');
        setEmployee(res.data);
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await employeeService.toggleStatus(id);
      if (res.success) {
        toast.success(`Status updated to ${res.data.status}`);
        setEmployee(res.data);
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center">
        <h3 className="text-lg font-bold text-white mb-2">Employee Not Found</h3>
        <Link to="/employees" className="text-xs text-indigo-400 font-semibold">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Back Button */}
      <Link to="/employees" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container with Upload Overlay */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-extrabold text-white overflow-hidden">
                {employee.profileImagePath ? (
                  <img src={employee.profileImagePath} alt={employee.fullName} className="w-full h-full object-cover" />
                ) : (
                  employee.fullName[0]
                )}
              </div>
            </div>
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg transition-transform hover:scale-110">
              <Camera className="w-4 h-4" />
              <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" />
            </label>
          </div>

          {/* Employee Basic Specs */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-extrabold text-white">{employee.fullName}</h2>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {employee.employeeIdCode}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-300">{employee.designation}</p>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> {employee.departmentName} Department
            </p>
          </div>

          {/* Action Status Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                employee.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {employee.status === 'ACTIVE' ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-rose-400" />}
              Status: {employee.status}
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Contact Information</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> Email</span>
              <span className="font-semibold text-slate-200">{employee.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> Phone</span>
              <span className="font-semibold text-slate-200">{employee.phone}</span>
            </div>
          </div>
        </div>

        {/* Employment & Compensation */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Employment Details</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /> Joining Date</span>
              <span className="font-semibold text-slate-200">{employee.joiningDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-500" /> Basic Salary</span>
              <span className="font-bold text-emerald-400">${Number(employee.salary).toLocaleString()} / yr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
