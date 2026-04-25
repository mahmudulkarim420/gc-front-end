"use client"
import Link from 'next/link';
import { useState } from 'react';
import { CreateGroupModal } from './chat/CreateGroupModal';

interface SidebarProps {
  onlineCount?: number;
  groups?: any[];
  members?: any[];
  onlineUserIds?: string[];
  currentUser?: any;
  onCreateGroup?: (name: string, imageUrl?: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  activeGroupId?: string | null;
  onSelectGroup?: (id: string) => void;
}

export function Sidebar({ 
  onlineCount = 0, 
  groups = [], 
  members = [], 
  onlineUserIds = [], 
  currentUser = null, 
  onCreateGroup = () => {},
  isOpen = false,
  onClose = () => {},
  activeGroupId = null,
  onSelectGroup = () => {}
}: SidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
    <nav className={`fixed left-0 top-0 h-full flex flex-col z-50 bg-[#0F172A] font-manrope antialiased text-sm tracking-tight w-64 border-r border-slate-800/50 transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="px-6 py-8 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-emerald-500 tracking-tighter">Workspace</span>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black text-[9px]">CollabChat Pro</p>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-500 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-8 custom-scrollbar">
        {/* Navigation */}
        <div className="space-y-1">
          <Link 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-emerald-400 hover:bg-slate-800/50 transition-all text-slate-400" href="/chat"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            <span>All Chats</span>
          </Link>
          
          <div className="pt-4 pb-2 px-3 flex items-center justify-between group">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Groups</span>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-all group/btn"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">New Chat</span>
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </button>
          </div>

          <div className="space-y-1">
            {groups.map((group) => {
              const isActive = group._id === activeGroupId;
              return (
                <Link 
                  key={group._id} 
                  onClick={() => {
                    onSelectGroup(group._id);
                    onClose();
                  }}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all group ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`} 
                  href="#"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded bg-slate-800 flex items-center justify-center overflow-hidden border ${
                      isActive ? 'border-emerald-500/50' : 'border-white/5'
                    }`}>
                      {group.imageUrl ? (
                        <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-emerald-500/50'}`}>#</span>
                      )}
                    </div>
                    <span className="truncate max-w-[120px]">{group.name}</span>
                  </div>
                  {group.name === 'Sales Team Workspace' && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] text-emerald-400 font-bold">{onlineCount}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Members Section */}
        <div>
          <div className="px-3 pb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Members</span>
          </div>
          <div className="space-y-1">
            {members.map((member) => {
              const isOnline = onlineUserIds.includes(member._id);
              return (
                <div 
                  key={member._id} 
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all group cursor-pointer"
                >
                  <div className="relative w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-500 border border-white/5 overflow-hidden">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.username} className="w-full h-full object-cover" />
                    ) : (
                      member.username[0].toUpperCase()
                    )}
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0F172A] ${
                      isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'
                    }`}></div>
                  </div>
                  <span className={`text-sm ${isOnline ? 'text-slate-200' : 'text-slate-500'}`}>{member.username}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="mt-auto p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link href="/profile" onClick={onClose} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 border border-emerald-500/20 overflow-hidden">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser?.username?.[0].toUpperCase() || '?'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{currentUser?.username || 'Guest'}</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</span>
            </div>
          </Link>
          <Link href="/profile" onClick={onClose} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors">
            <span className="material-symbols-outlined text-lg">settings</span>
          </Link>
        </div>
      </div>
    </nav>
    <CreateGroupModal 
      isOpen={showCreateModal} 
      onClose={() => setShowCreateModal(false)}
      onCreate={onCreateGroup}
    />
    </>
  );
}
