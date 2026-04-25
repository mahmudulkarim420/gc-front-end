'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DangerZone() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/users/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        localStorage.removeItem('user');
        alert('Account deleted. Redirecting to login...');
        router.push('/login');
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-red-500/5 border border-red-500/20 rounded-xl p-8 font-manrope">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-red-500 mb-1">Delete Account</h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Permanently remove your data and access from CollabChat.</p>
        </div>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="px-8 py-3 bg-transparent border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete Forever'}
        </button>
      </div>
    </div>
  );
}
