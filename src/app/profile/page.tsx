'use client';

import { Sidebar } from '@/components/Sidebar';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { AccountStatus } from '@/components/profile/AccountStatus';
import { DangerZone } from '@/components/profile/DangerZone';
import { useChat } from '@/hooks/useChat';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const { 
    groups, 
    members, 
    onlineUserIds, 
    createGroup 
  } = useChat(currentUser?.id || '', null);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar 
        onlineCount={onlineUserIds.length} 
        groups={groups}
        members={members}
        onlineUserIds={onlineUserIds}
        currentUser={currentUser}
        onCreateGroup={createGroup}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 md:ml-64 flex flex-col h-full bg-background relative overflow-y-auto scroll-smooth">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-4 p-4 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-bold text-emerald-500 tracking-tighter">My Profile</h1>
        </div>

        <div className="p-4 md:p-[16px] max-w-[1200px] mx-auto min-h-[calc(100vh-64px)] w-full">
          <div className="py-6 md:py-12 px-2 md:px-[24px]">
            <ProfileHero />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <SecuritySettings />
              <AccountStatus />
            </div>

            <DangerZone />
          </div>
        </div>
      </main>
    </div>
  );
}
