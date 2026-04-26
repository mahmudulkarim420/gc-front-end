'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, API_BASE_URL } from '@/config/constants';

export const useChat = (senderId: string, activeGroupId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('Workspace');
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // 1. Fetch initial data (Groups & Members)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [groupRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/groups`),
          fetch(`${API_BASE_URL}/users`)
        ]);
        const grps = await groupRes.json();
        const mbrs = await userRes.json();
        setGroups(grps);
        setMembers(mbrs);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Handle Group Switching (Fetch Messages & Join Room)
  useEffect(() => {
    if (!activeGroupId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages?groupId=${activeGroupId}`);
        const data = await res.json();
        setMessages(data);
        
        const currentGroup = groups.find(g => g._id === activeGroupId);
        if (currentGroup) setGroupName(currentGroup.name);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    if (socket) {
      socket.emit('join_group', activeGroupId);
    }
  }, [activeGroupId, groups, socket]);

  // 3. Initialize Socket
  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      if (senderId) socketInstance.emit('register_user', senderId);
      if (activeGroupId) socketInstance.emit('join_group', activeGroupId);
    });

    socketInstance.on('online_users', (userIds) => {
      setOnlineUserIds(userIds);
    });

    socketInstance.on('group_created', (newGroup) => {
      setGroups((prev) => [...prev, newGroup]);
    });

    socketInstance.on('group_updated', (updatedGroup) => {
      setGroups((prev) => prev.map(g => g._id === updatedGroup._id ? updatedGroup : g));
      if (updatedGroup._id === activeGroupId) setGroupName(updatedGroup.name);
    });

    socketInstance.on('group_deleted', (deletedGroupId) => {
      setGroups((prev) => prev.filter(g => g._id !== deletedGroupId));
    });

    socketInstance.on('receive_message', (message) => {
      setMessages((prev) => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socketInstance.on('message_updated', (updatedMessage) => {
      setMessages((prev) => prev.map(m => m._id === updatedMessage._id ? updatedMessage : m));
    });

    socketInstance.on('message_deleted', (deletedMessageId) => {
      setMessages((prev) => prev.filter(m => m._id !== deletedMessageId));
    });

    socketInstance.on('user_typing', (username) => {
      setTypingUsers((prev) => [...new Set([...prev, username])]);
    });

    socketInstance.on('user_stop_typing', (username) => {
      setTypingUsers((prev) => prev.filter(u => u !== username));
    });

    socketInstance.on('reaction_updated', (updatedMessage) => {
      setMessages((prev) => prev.map(m => m._id === updatedMessage._id ? updatedMessage : m));
    });

    socketInstance.on('user_updated', (updatedUser) => {
      setMembers((prev) => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
    });

    socketInstance.on('user_deleted', (deletedUserId) => {
      setMembers((prev) => prev.filter(u => u._id !== deletedUserId));
    });

    setSocket(socketInstance);
    return () => { socketInstance.disconnect(); };
  }, [senderId, activeGroupId]);

  const createGroup = useCallback((name: string, imageUrl?: string) => {
    socket?.emit('create_group', { name, imageUrl });
  }, [socket]);

  const addReaction = useCallback((messageId: string, userId: string, emoji: string) => {
    if (!activeGroupId) return;
    socket?.emit('add_reaction', { messageId, userId, emoji, room: activeGroupId });
  }, [socket, activeGroupId]);

  const editMessage = useCallback((messageId: string, content: string) => {
    if (!activeGroupId) return;
    socket?.emit('edit_message', { messageId, content, room: activeGroupId });
  }, [socket, activeGroupId]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!activeGroupId) return;
    socket?.emit('delete_message', { messageId, room: activeGroupId });
  }, [socket, activeGroupId]);

  const deleteGroup = useCallback((groupId: string) => {
    socket?.emit('delete_group', groupId);
  }, [socket]);

  const updateGroup = useCallback((groupId: string, newName?: string, newImage?: string) => {
    socket?.emit('update_group', { groupId, newName, newImage });
  }, [socket]);

  const sendMessage = useCallback((content: string, type: 'text' | 'image' | 'video' = 'text') => {
    if (socket && isConnected && activeGroupId) {
      socket.emit('send_message', { senderId, groupId: activeGroupId, content, type });
    }
  }, [socket, isConnected, senderId, activeGroupId]);

  const sendTyping = useCallback((username: string) => { 
    if (activeGroupId) socket?.emit('typing', username, activeGroupId); 
  }, [socket, activeGroupId]);

  const sendStopTyping = useCallback((username: string) => { 
    if (activeGroupId) socket?.emit('stop_typing', username, activeGroupId); 
  }, [socket, activeGroupId]);

  return { 
    messages, sendMessage, isConnected, typingUsers, 
    sendTyping, sendStopTyping, addReaction, groupName, 
    updateGroup, groups, members, onlineUserIds, createGroup,
    editMessage, deleteMessage, deleteGroup
  };
};
