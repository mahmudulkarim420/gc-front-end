'use client';

import { useState, KeyboardEvent, useRef } from 'react';

interface MessageInputProps {
  onSend: (content: string, type?: 'text' | 'image' | 'video') => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

export function MessageInput({ onSend, onTyping, onStopTyping }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      if (typingTimeout) clearTimeout(typingTimeout);
      onStopTyping();
    }
  };

  const handleChange = (content: string) => {
    setMessage(content);
    
    // Typing logic
    if (typingTimeout) clearTimeout(typingTimeout);
    else onTyping();

    const timeout = setTimeout(() => {
      onStopTyping();
      setTypingTimeout(null);
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onSend(data.url, data.resource_type);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <footer className="p-[24px] pt-2 bg-background/50 backdrop-blur-md relative">
      {isUploading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse z-50"></div>
      )}
      
      <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-2 flex items-end gap-2 shadow-2xl relative">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,video/*"
        />
        
        <div className="flex items-center gap-1 pb-1 pl-1">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined">{isUploading ? 'sync' : 'add_circle'}</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-2 resize-none font-body-lg placeholder:text-slate-600 outline-none" 
            placeholder={isUploading ? "Uploading file..." : "Message #Sales-Team"} 
            rows={1}
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isUploading}
          ></textarea>
        </div>
        <div className="flex items-center gap-1 pb-1 pr-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">mood</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <button 
            onClick={handleSend}
            disabled={isUploading}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg shadow-primary/20 ${
              isUploading ? 'bg-slate-700 text-slate-500' : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-600 mt-2 font-label-caps tracking-widest">
        PRESS <span className="bg-surface-container-high px-1 rounded">ENTER</span> TO SEND • <span className="bg-surface-container-high px-1 rounded">SHIFT + ENTER</span> FOR NEW LINE
      </p>
    </footer>
  );
}
