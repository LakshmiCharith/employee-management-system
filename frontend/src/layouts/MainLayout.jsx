import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Sticky Header Navbar */}
        <Navbar collapsed={collapsed} />

        {/* Dynamic Page Router Outlet */}
        <main className="flex-1 pt-20 px-6 pb-6 max-w-7xl w-full mx-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
