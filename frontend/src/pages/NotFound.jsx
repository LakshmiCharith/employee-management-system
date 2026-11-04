import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-3xl text-center max-w-md w-full relative z-10 space-y-5"
      >
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Compass className="w-9 h-9 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold text-white">404</h2>
          <h3 className="text-base font-bold text-slate-300">Page Not Found</h3>
          <p className="text-xs text-slate-400">
            The resource you are looking for has been relocated or is currently restricted.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/10"
        >
          Return to Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
