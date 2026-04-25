'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
  reactions?: Array<{ userId: string; emoji: string }>;
}

interface MessageFeedProps {
  messages: Message[];
  currentUserId: string;
  searchTerm: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  groupName: string;
}

export function MessageFeed({ 
  messages, 
  currentUserId, 
  searchTerm, 
  onAddReaction, 
  onEditMessage,
  onDeleteMessage,
  groupName 
}: MessageFeedProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleEditSubmit = (id: string) => {
    if (editContent.trim()) {
      onEditMessage(id, editContent);
      setEditingId(null);
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} className="bg-emerald-500/40 text-white rounded px-0.5">{part}</mark> 
        : part
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-[24px] py-8 space-y-8 flex flex-col scroll-smooth">
      {/* ... date ... */}
      <div className="flex justify-center">
        <span className="font-label-caps text-label-caps text-slate-500 bg-surface-container-low px-4 py-1.5 rounded-full uppercase">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {filteredMessages.map((msg, idx) => {
        if (!msg) return null;
        
        const isOutgoing = (msg.sender?._id || (msg as any).sender) === currentUserId;
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
        const senderName = msg.sender?.username || 'System User';
        const avatarInitial = (senderName[0] || '?').toUpperCase();

        return (
          <div 
            key={msg._id} 
            className={`flex items-start gap-4 max-w-[800px] group ${isOutgoing ? 'flex-row-reverse ml-auto' : ''}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 mt-1 shadow-lg overflow-hidden ${
              isOutgoing ? 'bg-emerald-500 text-white' : 'bg-primary/20 text-primary'
            }`}>
              {msg.sender?.avatarUrl ? (
                <img src={msg.sender.avatarUrl} alt={senderName} className="w-full h-full object-cover" />
              ) : (
                avatarInitial
              )}
            </div>
            <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} gap-1`}>
              <div className={`flex items-baseline gap-2 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                <span className="font-body-sm font-bold text-slate-200">{senderName}</span>
                <span className="text-[10px] text-slate-500 uppercase">{time}</span>
              </div>
              <div className="relative group/bubble flex items-center gap-2">
                {/* Message Options Menu */}
                {isOutgoing && !editingId && (
                  <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === msg._id ? null : msg._id)}
                      className="p-1 text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                    
                    {activeMenuId === msg._id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 bottom-full mb-2 w-32 bg-[#0F172A] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                          <button 
                            onClick={() => { setEditingId(msg._id); setEditContent(msg.content); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-emerald-400 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button 
                            onClick={() => { if (confirm('Delete this message?')) onDeleteMessage(msg._id); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {editingId === msg._id ? (
                  <div className="bg-slate-800 rounded-2xl p-2 min-w-[200px] border border-emerald-500/30">
                    <textarea 
                      autoFocus
                      className="w-full bg-transparent text-slate-200 text-sm outline-none resize-none px-2 py-1"
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleEditSubmit(msg._id);
                        }
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-slate-500 hover:text-white px-2">Cancel</button>
                      <button onClick={() => handleEditSubmit(msg._id)} className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">Save</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`px-4 py-3 rounded-2xl text-on-surface font-body-lg shadow-sm transition-all hover:shadow-md ${
                      isOutgoing 
                        ? 'bg-emerald-600/20 border-r-4 border-emerald-500 rounded-tr-none text-emerald-50' 
                        : 'bg-primary/10 border-l-4 border-primary rounded-tl-none text-slate-200'
                    }`}
                  >
                    {msg.type === 'image' ? (
                      <img 
                        src={msg.content} 
                        alt="Shared image" 
                        className="max-w-full max-h-[400px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.content, '_blank')}
                      />
                    ) : msg.type === 'video' ? (
                      <video 
                        src={msg.content} 
                        controls 
                        className="max-w-full max-h-[400px] rounded-xl outline-none"
                      />
                    ) : (
                      highlightText(msg.content, searchTerm)
                    )}
                  </div>
                )}
                
                {/* Reaction Picker Overlay */}
                <div className={`absolute -top-8 ${isOutgoing ? 'right-0' : 'left-0'} opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-surface-container-high rounded-full px-2 py-1 flex gap-1 shadow-xl border border-white/10 z-10`}>
                  {['❤️', '👍', '🔥', '😂'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => onAddReaction(msg._id, emoji)}
                      className="hover:scale-125 transition-transform text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Display Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`absolute -bottom-6 ${isOutgoing ? 'right-0' : 'left-0'} flex gap-1 mt-1`}>
                    {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                      <span key={emoji} className="bg-slate-900 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1 shadow-lg">
                        {emoji} <span className="text-slate-400">{msg.reactions?.filter(r => r.emoji === emoji).length}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={scrollRef} />

      {filteredMessages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
          <span className="material-symbols-outlined text-6xl">chat_bubble</span>
          <p className="font-body-lg">
            {searchTerm ? 'No matches found.' : `This is the start of the ${groupName || 'group'} chat!`}
          </p>
        </div>
      )}
    </div>
  );
}
