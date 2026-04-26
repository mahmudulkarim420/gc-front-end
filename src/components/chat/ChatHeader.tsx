import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/constants";

interface ChatHeaderProps {
  groupName: string;
  groupImage?: string;
  onUpdateGroup: (name?: string, image?: string) => void;
  onDeleteGroup: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  typingUsers: string[];
  onlineCount: number;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  groupName,
  groupImage,
  onUpdateGroup,
  onDeleteGroup,
  searchTerm,
  onSearchChange,
  typingUsers,
  onlineCount,
  onToggleSidebar,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(groupName);
  const [isUploading, setIsUploading] = useState(false);

  // Sync newName with groupName prop when it changes (e.g., when switching groups)
  useEffect(() => {
    setNewName(groupName);
  }, [groupName]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleUpdate = () => {
    onUpdateGroup(newName);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateGroup(undefined, data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading group image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <header className="flex justify-between items-center h-16 px-4 md:px-6 sticky top-0 z-30 w-full bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5 shadow-sm font-manrope text-base font-semibold">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative group/avatar">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-container/20 flex items-center justify-center border border-primary/20">
            {groupImage ? (
              <img className="w-full h-full object-cover" alt="Group avatar" src={groupImage} />
            ) : (
              <div className="text-emerald-500 font-bold">{groupName[0].toUpperCase()}</div>
            )}
          </div>
          <label className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            <span className="material-symbols-outlined text-white text-sm">
              {isUploading ? "sync" : "photo_camera"}
            </span>
          </label>
        </div>

        <div className="flex flex-col min-w-[100px] md:min-w-[120px]">
          {isEditing ? (
            <input
              className="bg-slate-800 border border-emerald-500/50 rounded px-2 py-1 text-sm text-white outline-none w-full max-w-[200px]"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-base md:text-xl font-black text-emerald-500 truncate max-w-[150px] md:max-w-none">
                {groupName}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-slate-500 text-sm hover:text-emerald-400 transition-all"
              >
                edit
              </button>
            </div>
          )}
          {typingUsers.length > 0 ? (
            <p className="text-[9px] md:text-[10px] text-emerald-400 italic animate-pulse tracking-tight truncate">
              {typingUsers[0]}
              {typingUsers.length > 1 ? ` & ${typingUsers.length - 1} others` : ""} typing...
            </p>
          ) : (
            <p className="text-[9px] md:text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              {onlineCount} Members Online
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Search */}
        <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-white/5 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
          <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder-slate-500 w-32 xl:w-48 outline-none"
            placeholder="Search..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-0 h-16 bg-[#0B0F1A] z-40 flex items-center px-4 gap-3 lg:hidden">
            <button onClick={() => setIsSearchOpen(false)} className="text-slate-400">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <input
              autoFocus
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder-slate-500 outline-none"
              placeholder="Search messages..."
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => onSearchChange("")} className="text-slate-500">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 md:gap-2 relative">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center hover:text-emerald-400 hover:bg-white/5 rounded-full transition-all text-slate-300"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              showOptions
                ? "bg-emerald-500/10 text-emerald-400"
                : "hover:text-emerald-400 hover:bg-white/5 text-slate-300"
            }`}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-12 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-emerald-400 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit Group
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${groupName}"? This will remove all messages.`,
                      )
                    ) {
                      onDeleteGroup();
                    }
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                  Delete Group
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
