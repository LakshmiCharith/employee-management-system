import React from 'react';
import { Terminal, Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-cyan-500/15 text-center text-xs font-mono text-slate-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-500" />
          <p>© 2026 NEXUS WORKFORCE // QUANTUM OPERATIONS v2.4</p>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            FIRESTORE CLOUD ACTIVE
          </span>
          <span className="text-slate-700">|</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">TELEMETRY</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">PRIVACY PROTOCOL</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">SYSTEM SPECS</span>
        </div>
      </div>
    </footer>
  );
}
