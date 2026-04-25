'use client';
import { useState } from 'react';
import { API_BASE_URL } from '@/config/constants';

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:col-span-8 bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 rounded-xl p-5 md:p-8 shadow-sm font-manrope">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <span className="material-symbols-outlined text-emerald-500 text-xl md:text-2xl">lock_reset</span>
        <h2 className="text-lg md:text-xl font-bold text-white">Security Settings</h2>
      </div>
      <form className="space-y-5 md:space-y-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Current Password</label>
            <input 
              className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2.5 md:py-3 text-slate-200 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all outline-none text-sm" 
              placeholder="••••••••••••" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
            <input 
              className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2.5 md:py-3 text-slate-200 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all outline-none text-sm" 
              placeholder="Enter new password" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
            <input 
              className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2.5 md:py-3 text-slate-200 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all outline-none text-sm" 
              placeholder="Repeat new password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button 
            disabled={loading}
            className="w-full md:w-auto bg-emerald-600 text-white hover:bg-emerald-500 font-bold px-8 py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs md:text-sm uppercase tracking-widest" 
            type="submit"
          >
            <span className="material-symbols-outlined text-base">{loading ? 'hourglass_top' : 'save'}</span>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
