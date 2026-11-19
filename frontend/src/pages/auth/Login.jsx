import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [roleTab, setRoleTab] = useState('ADMIN'); // 'ADMIN' or 'EMPLOYEE'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleRoleTabChange = (role) => {
    setRoleTab(role);
    setUsernameOrEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      toast.error('Please enter both username/email and password');
      return;
    }

    const res = await login(usernameOrEmail, password);
    if (res.success) {
      toast.success(`Welcome back, ${res.data.fullName || res.data.username}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      {/* Futuristic Cyber Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Futuristic Cyber Header */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <Logo size="lg" className="mb-2" />
          <p className="font-mono text-cyan-400/80 text-[11px] uppercase tracking-widest mt-1">
            // QUANTUM IDENTITY VERIFICATION //
          </p>
        </div>

        {/* Glass Form Container */}
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-cyber-panel relative z-10 space-y-6">
          {/* Security Level Clearance Selector */}
          <div className="flex bg-[#040817] p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleTabChange('ADMIN')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all duration-200 uppercase tracking-wider ${
                roleTab === 'ADMIN'
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('EMPLOYEE')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all duration-200 uppercase tracking-wider ${
                roleTab === 'EMPLOYEE'
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Personnel Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Input */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-cyan-300/90 mb-1.5 uppercase tracking-widest">
                IDENTITY IDENTIFIER (EMAIL / USERNAME)
              </label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon-left" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="name@company.com or username"
                  className="input-with-icon"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono font-bold text-cyan-300/90 uppercase tracking-widest">
                  ACCESS CIPHER (PASSWORD)
                </label>
                <Link to="/forgot-password" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                  RESET CIPHER?
                </Link>
              </div>
              <div className="input-icon-wrapper">
                <Lock className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-with-icon pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl btn-cyber-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs font-mono text-slate-400">
            UNREGISTERED PERSONNEL?{' '}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold underline">
              CREATE CREDENTIALS
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
