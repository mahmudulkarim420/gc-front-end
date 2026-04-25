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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const { 
    groups, 
    members, 
    onlineUserIds, 
    createGroup 
  } = useChat(currentUser?.id || '');

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar 
        onlineCount={onlineUserIds.length} 
        groups={groups}
        members={members}
        onlineUserIds={onlineUserIds}
        currentUser={currentUser}
        onCreateGroup={createGroup}
      />
      <main className="flex-1 ml-64 flex flex-col h-full bg-background relative overflow-y-auto scroll-smooth">

        <div className="p-[16px] max-w-[1200px] mx-auto min-h-[calc(100vh-64px)] w-full">
          <div className="py-12 px-[24px]">
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
