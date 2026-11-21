import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-3xl text-center max-w-md w-full relative z-10 space-y-6 border border-cyan-500/15"
        style={{ boxShadow: '0 0 50px rgba(0,245,255,0.05)' }}
      >
        <div className="w-20 h-20 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10" style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.6))' }} />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">// NEXUS_EMS :: NODE_ERROR</p>
          <h2 className="text-6xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">404</h2>
          <h3 className="text-base font-black font-cyber text-slate-200 uppercase tracking-widest">// NODE NOT FOUND</h3>
          <p className="text-xs text-slate-500 font-mono leading-relaxed">
            The requested resource endpoint has been relocated,<br />decommissioned, or access is restricted.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">SIGNAL LOST :: REROUTING...</span>
        </div>
        <Link to="/dashboard" className="btn-cyber-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black">
          <ArrowRight className="w-4 h-4" /> RETURN TO HOME BASE
        </Link>
      </motion.div>
    </div>
  );
}
