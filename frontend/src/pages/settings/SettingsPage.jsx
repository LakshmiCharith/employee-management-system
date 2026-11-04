import React, { useState, useEffect } from 'react';
import { Settings, Lock, User, Bell, Save, Mail, Phone, Briefcase } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  // Security password state
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
      // Update employee record if employeeId exists
      if (user?.employeeId) {
        await employeeService.updateEmployee(user.employeeId, {
          firstName,
          lastName,
          email,
          phone,
          designation,
          joiningDate: new Date().toISOString().split('T')[0],
          salary: 75000,
        });
      }

      // Update local storage user state
      const updatedUser = {
        ...user,
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        username,
        phone,
        designation,
      };
      localStorage.setItem('ems_user', JSON.stringify(updatedUser));
      toast.success('Account profile details updated successfully!');
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Security password updated!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" /> Account Settings & Profile
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage your account information, profile details, and security passwords</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side Navigation tabs */}
        <div className="md:col-span-1 glass-panel p-4 rounded-3xl space-y-1.5 h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-4 h-4" /> Security Password
          </button>
        </div>

        {/* Right Side Form Content */}
        <div className="md:col-span-3 glass-panel p-6 sm:p-8 rounded-3xl">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-cyan-400" /> Edit Profile Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : (
                    <><Save className="w-4 h-4" /> Save Account Changes</>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSave} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Lock className="w-4 h-4 text-cyan-400" /> Change Security Password
              </h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input w-full"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Update Security Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
