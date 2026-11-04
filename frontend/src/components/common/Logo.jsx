import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Shield } from 'lucide-react';

export default function Logo({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon Container */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-xl shadow-cyan-500/25 ${
          isSm ? 'w-8 h-8 p-1.5' : isLg ? 'w-14 h-14 p-3' : 'w-10 h-10 p-2'
        }`}
      >
        <Layers className={`${isSm ? 'w-4 h-4' : isLg ? 'w-8 h-8' : 'w-5 h-5'} stroke-[2.5] text-slate-950`} />
        
        {/* Subtle Ambient Sparkle */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping opacity-75" />
      </motion.div>

      {/* Brand Text Branding */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-white ${isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-base'}`}>
            NEXUS
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            EMS
          </span>
        </div>
        <span className={`font-bold text-slate-400 uppercase tracking-widest ${isSm ? 'text-[9px]' : isLg ? 'text-xs' : 'text-[10px]'}`}>
          Workforce System
        </span>
      </div>
    </div>
  );
}
