import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function Logo({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Cyber Emblem Icon Container */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.94 }}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 font-black shadow-lg shadow-cyan-500/30 border border-cyan-300/40 ${
          isSm ? 'w-8 h-8 p-1.5' : isLg ? 'w-13 h-13 p-3' : 'w-10 h-10 p-2'
        }`}
      >
        <Cpu className={`${isSm ? 'w-4 h-4' : isLg ? 'w-7 h-7' : 'w-5 h-5'} stroke-[2.5] text-slate-950`} />
        
        {/* Pulsing Cyber Core Light */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping opacity-80" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
      </motion.div>

      {/* Futuristic Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-cyber font-black tracking-wider text-white neon-text-cyan ${
            isSm ? 'text-xs' : isLg ? 'text-xl' : 'text-sm'
          }`}>
            NEXUS
          </span>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm">
            v2.4
          </span>
        </div>
        <span className={`font-mono text-slate-400 uppercase tracking-widest ${
          isSm ? 'text-[8px]' : isLg ? 'text-[10px]' : 'text-[9px]'
        }`}>
          // QUANTUM HR OPS
        </span>
      </div>
    </div>
  );
}
