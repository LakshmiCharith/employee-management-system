import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Building2, Briefcase, ArrowRight, ArrowLeft, ShieldCheck, UserCheck, Cpu } from 'lucide-react';
import { authService } from '../../services/authService';
import api from '../../services/api';
import Logo from '../../components/common/Logo';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [accountType, setAccountType] = useState('ROLE_EMPLOYEE');
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

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) setDepartments(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        firstName, lastName, username, email, password, phone,
        designation: designation || (accountType === 'ROLE_ADMIN' ? 'Administrator' : 'Developer'),
        departmentId: departmentId ? Number(departmentId) : undefined,
        role: accountType,
      };
      const res = await authService.signup(data);
      if (res.success) {
        toast.success('Credentials initialized! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = accountType === 'ROLE_ADMIN';

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl pointer-events-none" />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/15 shadow-2xl space-y-6"
          style={{ boxShadow: '0 0 60px rgba(0,245,255,0.07), 0 0 120px rgba(168,85,247,0.04)' }}>

          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> // BACK_TO_LOGIN
            </Link>
            <Logo size="sm" />
          </div>

          {/* Title */}
          <div>
            <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">// NEXUS_EMS :: CREDENTIAL_INIT</p>
            <h2 className="text-2xl font-black font-cyber text-white tracking-tight mt-1" style={{ textShadow: '0 0 20px rgba(0,245,255,0.3)' }}>
              CREATE CREDENTIALS
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">Initialize your operative profile in the NEXUS system</p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex bg-[#070b18] p-1.5 rounded-2xl border border-cyan-500/15">
            {[
              { value: 'ROLE_EMPLOYEE', icon: UserCheck, label: '// OPERATIVE' },
              { value: 'ROLE_ADMIN', icon: ShieldCheck, label: '// ADMIN_NODE' },
            ].map(({ value, icon: Icon, label }) => (
              <button key={value} type="button" onClick={() => setAccountType(value)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 font-mono ${
                  accountType === value
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'FIRST_NAME', value: firstName, setter: setFirstName, type: 'text', Icon: User, placeholder: 'First name' },
                { label: 'LAST_NAME', value: lastName, setter: setLastName, type: 'text', Icon: User, placeholder: 'Last name' },
                { label: 'USERNAME', value: username, setter: setUsername, type: 'text', Icon: User, placeholder: 'Username' },
                { label: 'EMAIL_ADDRESS', value: email, setter: setEmail, type: 'email', Icon: Mail, placeholder: 'Email address' },
                { label: 'ACCESS_CIPHER', value: password, setter: setPassword, type: 'password', Icon: Lock, placeholder: 'Password' },
                { label: 'COMM_CHANNEL', value: phone, setter: setPhone, type: 'text', Icon: Phone, placeholder: 'Phone number' },
                { label: 'DESIGNATION', value: designation, setter: setDesignation, type: 'text', Icon: Briefcase, placeholder: isAdmin ? 'Administrator' : 'Developer' },
              ].map(({ label, value, setter, type, Icon, placeholder }) => (
                <div key={label}>
                  <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px] mb-1.5">// {label}</label>
                  <div className="input-icon-wrapper">
                    <Icon className="input-icon-left" />
                    <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder} className="input-with-icon font-mono" required={label !== 'DESIGNATION'} />
                  </div>
                </div>
              ))}

              {/* Department */}
              <div>
                <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px] mb-1.5">// SECTOR_ASSIGNMENT</label>
                <div className="input-icon-wrapper">
                  <Building2 className="input-icon-left" />
                  <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input-with-icon bg-[#070b18] font-mono">
                    <option value="">Select Sector</option>
                    {(departments.length ? departments : [
                      { id: 1, name: 'Engineering' }, { id: 2, name: 'Human Resources' }
                    ]).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-cyber-primary w-full mt-4 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>INITIALIZE {isAdmin ? 'ADMIN' : 'OPERATIVE'} PROFILE <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
