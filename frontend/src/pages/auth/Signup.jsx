import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Building2, Briefcase, ArrowRight, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import api from '../../services/api';
import Logo from '../../components/common/Logo';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [accountType, setAccountType] = useState('ROLE_EMPLOYEE'); // 'ROLE_ADMIN' or 'ROLE_EMPLOYEE'
  const [departments, setDepartments] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        designation: designation || (accountType === 'ROLE_ADMIN' ? 'Administrator' : 'Developer'),
        departmentId: departmentId ? Number(departmentId) : undefined,
        role: accountType,
      };

      const res = await authService.signup(data);
      if (res.success) {
        toast.success('Registration successful! Please sign in with your credentials.');
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <Logo size="sm" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Register your profile in the corporate portal</p>
          </div>

          {/* Account Type Selector Tabs */}
          <div className="flex bg-[#090d16] p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAccountType('ROLE_EMPLOYEE')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                accountType === 'ROLE_EMPLOYEE'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Employee Account
            </button>
            <button
              type="button"
              onClick={() => setAccountType('ROLE_ADMIN')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                accountType === 'ROLE_ADMIN'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">First Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon-left" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Last Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon-left" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Username</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon-left" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon-left" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Password</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon-left" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone className="input-icon-left" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Designation</label>
                <div className="input-icon-wrapper">
                  <Briefcase className="input-icon-left" />
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder={accountType === 'ROLE_ADMIN' ? 'Administrator' : 'Developer'}
                    className="input-with-icon"
                  />
                </div>
              </div>

              {/* Department selection */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">Department</label>
                <div className="input-icon-wrapper">
                  <Building2 className="input-icon-left" />
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="input-with-icon bg-[#090d16]"
                  >
                    <option value="">Select Department</option>
                    {(departments.length ? departments : [
                      { id: 1, name: 'Engineering' },
                      { id: 2, name: 'Human Resources' }
                    ]).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create {accountType === 'ROLE_ADMIN' ? 'Admin' : 'Employee'} Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
