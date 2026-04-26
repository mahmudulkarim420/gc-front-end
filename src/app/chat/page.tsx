"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageFeed } from "@/components/chat/MessageFeed";
import { MessageInput } from "@/components/chat/MessageInput";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";

export default function ChatPage() {
  // In a real app, this would come from an AuthContext
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    // Get user from localStorage (set during login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // Fallback for demo if no login flow exists yet
      const mockUser = {
        id: "662b6b5e0000000000000001",
        username: "Guest_User",
      };
      setCurrentUser(mockUser);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Debug: Track activeGroupId changes
  useEffect(() => {
    console.log("[ChatPage] activeGroupId changed:", activeGroupId);
  }, [activeGroupId]);

  const {
    messages,
    sendMessage,
    isConnected,
    typingUsers,
    sendTyping,
    sendStopTyping,
    addReaction,
    groupName,
    updateGroup,
    groups,
    members,
    onlineUserIds,
    createGroup,
    editMessage,
    deleteMessage,
    deleteGroup,
  } = useChat(currentUser?.id || "", activeGroupId);

  // Redirect to first group if active group is deleted
  useEffect(() => {
    if (groups.length > 0 && activeGroupId) {
      const groupExists = groups.some((g) => g._id === activeGroupId);
      if (!groupExists) {
        setActiveGroupId(groups[0]._id);
      }
    }
  }, [groups, activeGroupId]);

  // Initialize activeGroupId with the first group once groups load
  useEffect(() => {
    console.log(
      "[ChatPage] Groups changed:",
      groups.length,
      "groups, activeGroupId:",
      activeGroupId,
      "groups data:",
      groups,
    );
    if (groups.length > 0 && !activeGroupId) {
      console.log("[ChatPage] Setting initial group to:", groups[0]._id);
      setActiveGroupId(groups[0]._id);
    }
  }, [groups]); // Removed activeGroupId from deps to prevent race condition

  // Get active group data
  const activeGroup = groups.find((g) => g._id === activeGroupId) || groups[0];

  return (
    <div className="flex h-screen w-full bg-[#0B0F1A] overflow-hidden relative font-manrope">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        onlineCount={onlineUserIds.length}
        groups={groups}
        members={members}
        onlineUserIds={onlineUserIds}
        currentUser={currentUser}
        onCreateGroup={createGroup}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeGroupId={activeGroupId}
        onSelectGroup={(id) => {
          console.log("[ChatPage] onSelectGroup called with id:", id);
          setActiveGroupId(id);
        }}
      />

      <main className="flex-1 flex flex-col h-full bg-background relative transition-all duration-300 md:ml-64">
        <ChatHeader
          groupName={activeGroup?.name || "Workspace"}
          groupImage={activeGroup?.imageUrl}
          onUpdateGroup={(name, image) => updateGroup(activeGroupId || "", name, image)}
          onDeleteGroup={() => activeGroupId && deleteGroup(activeGroupId)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typingUsers={typingUsers}
          onlineCount={onlineUserIds.length}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <div className="absolute top-14 right-4 z-10 flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-red-500"}`}
            ></span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
        <MessageFeed
          messages={messages}
          currentUserId={currentUser?.id || ""}
          searchTerm={searchTerm}
          onAddReaction={(messageId, emoji) => addReaction(messageId, currentUser?.id || "", emoji)}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          groupName={groupName}
        />
        {activeGroupId ? (
          <MessageInput
            onSend={sendMessage}
            onTyping={() => sendTyping(currentUser?.username || "Anonymous")}
            onStopTyping={() => sendStopTyping(currentUser?.username || "Anonymous")}
          />
        ) : (
          <div className="p-4 text-center text-slate-400">Select a group to start messaging</div>
        )}
      </main>
    </div>
  );
}
