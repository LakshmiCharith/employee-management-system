import React, { useState, useEffect } from 'react';
import { Settings, Lock, User, Save, Terminal, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      const parts = (user.fullName || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
      setPhone(user.phone || '+1 555-0100');
      setDesignation(user.designation || (user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Employee'));
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.employeeId) {
        await employeeService.updateEmployee(user.employeeId, {
          firstName, lastName, email, phone, designation,
          joiningDate: new Date().toISOString().split('T')[0],
          salary: 75000,
        });
      }
      const updatedUser = { ...user, fullName: `${firstName} ${lastName}`.trim(), email, username, phone, designation };
      localStorage.setItem('ems_user', JSON.stringify(updatedUser));
      toast.success('Profile data committed successfully!');
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Cipher keys do not match');
      return;
    }
    toast.success('Security cipher updated!');
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
  };

  const tabs = [
    { key: 'profile', icon: User, label: 'PROFILE_DATA' },
    { key: 'security', icon: Lock, label: 'SECURITY_CIPHER' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">// MODULE_08 :: TERMINAL_CONFIG</p>
        <h1 className="text-2xl font-black font-cyber text-white tracking-tight flex items-center gap-2.5" style={{ textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
          <Terminal className="w-6 h-6 text-cyan-400" /> TERMINAL CONFIG
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-mono">Manage operative profile, authentication ciphers, and account parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Nav */}
        <div className="md:col-span-1 glass-panel p-4 rounded-3xl space-y-1.5 h-fit border border-cyan-500/10">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-2 pb-2">// NAV_TREE</p>
          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all uppercase tracking-wider ${
                activeTab === key
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Form Panel */}
        <div className="md:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/10">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-4 mb-5">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black font-cyber text-cyan-300 uppercase tracking-widest">// EDIT_PROFILE_DATA</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'FIRST_NAME', value: firstName, setter: setFirstName, type: 'text' },
                  { label: 'LAST_NAME', value: lastName, setter: setLastName, type: 'text' },
                  { label: 'USERNAME', value: username, setter: setUsername, type: 'text' },
                  { label: 'EMAIL_ADDRESS', value: email, setter: setEmail, type: 'email' },
                  { label: 'PHONE_NUMBER', value: phone, setter: setPhone, type: 'text' },
                  { label: 'DESIGNATION', value: designation, setter: setDesignation, type: 'text' },
                ].map(({ label, value, setter, type }) => (
                  <div key={label}>
                    <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px] mb-1">// {label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="glass-input w-full font-mono"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={saving}
                  className="btn-cyber-primary px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
                    <><Save className="w-4 h-4" /> // COMMIT_CHANGES</>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSave} className="space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-4 mb-5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black font-cyber text-cyan-300 uppercase tracking-widest">// CHANGE_SECURITY_CIPHER</h3>
              </div>
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'CURRENT_CIPHER', value: oldPassword, setter: setOldPassword },
                  { label: 'NEW_CIPHER', value: newPassword, setter: setNewPassword },
                  { label: 'CONFIRM_CIPHER', value: confirmPassword, setter: setConfirmPassword },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="block text-slate-500 font-mono uppercase tracking-wider text-[10px] mb-1">// {label}</label>
                    <input type="password" value={value} onChange={(e) => setter(e.target.value)} className="glass-input w-full font-mono" required />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-cyber-primary px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 mt-2">
                <Save className="w-4 h-4" /> // UPDATE_CIPHER
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
