'use client';
import { useState, useRef } from 'react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, imageUrl?: string) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreate }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, imageUrl);
      setName('');
      setImageUrl('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl p-8 shadow-2xl font-manrope">
        <h2 className="text-2xl font-black text-white mb-6">Create New Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-slate-500">group</span>
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <span className="material-symbols-outlined text-white text-sm">
                  {isUploading ? 'sync' : 'photo_camera'}
                </span>
              </label>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Optional Group Icon</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Group Name</label>
            <input 
              autoFocus
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-all"
              placeholder="e.g. Design Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUploading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
