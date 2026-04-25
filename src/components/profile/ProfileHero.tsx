'use client';
import { useState, useEffect } from 'react';

export function ProfileHero() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUser(parsed);
      setUsername(parsed.username);
      setAvatarUrl(parsed.avatarUrl || '');
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, username, avatarUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, username, avatarUrl }));
        setIsEditing(false);
        alert('Profile updated!');
        window.location.reload(); // Refresh to sync Sidebar
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to Cloudinary
      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok) {
        // 2. Update User Profile in DB
        const profileRes = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: currentUser.id, 
            username, 
            avatarUrl: uploadData.url 
          }),
        });

        if (profileRes.ok) {
          const updatedUser = { ...currentUser, username, avatarUrl: uploadData.url };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setAvatarUrl(uploadData.url);
          alert('Profile photo updated!');
          window.location.reload();
        }
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center mb-16 font-manrope">
      <div className="relative mb-8 group">
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/40 to-blue-500/40 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-8 ring-slate-900/50">
          <img 
            alt="Profile" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=10b981&color=fff&size=200`}
          />
          
          {/* Change Photo Overlay */}
          <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            <span className="material-symbols-outlined text-white text-3xl mb-1">
              {loading ? 'sync' : 'photo_camera'}
            </span>
            <span className="text-[10px] text-white font-black uppercase tracking-widest">
              {loading ? 'Uploading...' : 'Change Photo'}
            </span>
          </label>
        </div>
      </div>

      <div className="text-center">
        {isEditing ? (
          <div className="flex flex-col items-center gap-4">
            <input 
              className="bg-slate-800/50 border-b-2 border-emerald-500 text-3xl md:text-5xl font-black text-center text-white outline-none px-4 py-2 rounded-t-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={handleUpdate}
                className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                Save Name
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-slate-700 text-slate-300 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 group/name">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2">
              {username}
            </h1>
            <button 
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover/name:opacity-100 p-2 bg-white/5 rounded-full text-slate-400 hover:text-emerald-400 transition-all"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
        )}
        
        <p className="text-slate-500 flex items-center justify-center gap-2 uppercase tracking-[0.3em] text-[10px] font-black mt-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
          Verification Status: Active
        </p>
      </div>
    </div>
  );
}
