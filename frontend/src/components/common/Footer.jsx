import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        <p>© 2026 Nexus Workforce System. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-300 cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
