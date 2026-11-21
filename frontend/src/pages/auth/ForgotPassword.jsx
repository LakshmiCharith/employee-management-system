import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Shield } from 'lucide-react';
import { authService } from '../../services/authService';
import Logo from '../../components/common/Logo';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success('Reset packet transmitted! Token: RESET-TOKEN-EMS');
        setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to transmit reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Background glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/15 shadow-2xl space-y-6"
          style={{ boxShadow: '0 0 60px rgba(0,245,255,0.07)' }}>

          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" /> // BACK_TO_LOGIN
            </Link>
            <Logo size="sm" />
          </div>

          {/* Icon */}
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/25 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.5))' }} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">// NEXUS_EMS :: CIPHER_RECOVERY</p>
              <h2 className="text-2xl font-black font-cyber text-white mt-1" style={{ textShadow: '0 0 20px rgba(0,245,255,0.3)' }}>
                CIPHER RECOVERY
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">
                Transmit your registered operative email to receive a cipher reset packet.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px] mb-1.5">// OPERATIVE_EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operative@nexus.corp"
                  className="glass-input w-full pl-10 font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-cyber-primary w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
                <>// TRANSMIT_RESET_PACKET <Send className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
