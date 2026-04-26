"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL, API_BASE_URL } from "@/config/constants";

export const useChat = (senderId: string, activeGroupId: string | null) => {
  console.log(
    "[useChat] Hook called with senderId:",
    senderId?.slice(0, 8) + "...",
    "activeGroupId:",
    activeGroupId,
  );

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("Workspace");
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // Keep refs to the latest values so callbacks always have fresh data
  const senderIdRef = useRef<string>("");
  useLayoutEffect(() => {
    senderIdRef.current = senderId;
  }, [senderId]);
  if (senderIdRef.current !== senderId) {
    senderIdRef.current = senderId;
  }

  const activeGroupIdRef = useRef<string | null>(null);
  // Use layout effect for synchronous updates before paint
  useLayoutEffect(() => {
    if (activeGroupIdRef.current !== activeGroupId) {
      console.log(
        "[useChat] activeGroupIdRef updating from",
        activeGroupIdRef.current,
        "to",
        activeGroupId,
      );
      activeGroupIdRef.current = activeGroupId;
    }
  }, [activeGroupId]);
  // Also do immediate sync check in render
  if (activeGroupIdRef.current !== activeGroupId) {
    activeGroupIdRef.current = activeGroupId;
  }

  // 1. Fetch initial data (Groups & Members)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        console.log("[useChat] Fetching groups and members from:", API_BASE_URL);
        const [groupRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/groups`),
          fetch(`${API_BASE_URL}/users`),
        ]);
        const grps = await groupRes.json();
        const mbrs = await userRes.json();
        console.log("[useChat] Groups fetched:", grps.length, "| Members fetched:", mbrs.length);
        setGroups(grps);
        setMembers(mbrs);
      } catch (error) {
        console.error("[useChat] Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Initialize Socket ONCE — no activeGroupId or senderId in deps
  useEffect(() => {
    console.log("[useChat] Initializing socket connection to:", SOCKET_URL);
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log(
        "[useChat] Socket connected. ID:",
        socketInstance.id,
        "| Sender:",
        senderIdRef.current,
      );
      setIsConnected(true);
      if (senderIdRef.current) {
        socketInstance.emit("register_user", senderIdRef.current);
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[useChat] Socket connection error:", err.message);
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("[useChat] Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("online_users", (userIds) => {
      console.log("[useChat] Online users updated:", userIds);
      setOnlineUserIds(userIds);
    });

    socketInstance.on("group_created", (newGroup) => {
      setGroups((prev) => [...prev, newGroup]);
    });

    socketInstance.on("group_updated", (updatedGroup) => {
      setGroups((prev) => prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
    });

    socketInstance.on("group_deleted", (deletedGroupId) => {
      setGroups((prev) => prev.filter((g) => g._id !== deletedGroupId));
    });

    socketInstance.on("receive_message", (message) => {
      console.log("[useChat] Received message:", message._id, "| Content:", message.content);
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socketInstance.on("message_updated", (updatedMessage) => {
      setMessages((prev) => prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)));
    });

    socketInstance.on("message_deleted", (deletedMessageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== deletedMessageId));
    });

    socketInstance.on("user_typing", (username) => {
      setTypingUsers((prev) => [...new Set([...prev, username])]);
    });

    socketInstance.on("user_stop_typing", (username) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    socketInstance.on("reaction_updated", (updatedMessage) => {
      setMessages((prev) => prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)));
    });

    socketInstance.on("user_updated", (updatedUser) => {
      setMembers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    });

    socketInstance.on("user_deleted", (deletedUserId) => {
      setMembers((prev) => prev.filter((u) => u._id !== deletedUserId));
    });

    setSocket(socketInstance);
    return () => {
      console.log("[useChat] Cleaning up socket connection.");
      socketInstance.disconnect();
    };
  }, []); // Empty deps: socket is created ONCE

  // 3. Re-register user when senderId becomes available (e.g., after login loads)
  useEffect(() => {
    if (socket && isConnected && senderId) {
      console.log("[useChat] Registering user with socket. SenderID:", senderId);
      socket.emit("register_user", senderId);
    }
  }, [socket, isConnected, senderId]);

  // 4. Join group room and fetch messages whenever activeGroupId changes
  useEffect(() => {
    if (!activeGroupId) return;

    console.log("[useChat] Switching to group:", activeGroupId);

    // Join socket room
    if (socket && isConnected) {
      socket.emit("join_group", activeGroupId);
    }

    // Fetch messages from DB
    const fetchMessages = async () => {
      try {
        console.log("[useChat] Fetching messages for group:", activeGroupId);
        const res = await fetch(`${API_BASE_URL}/messages?groupId=${activeGroupId}`);
        const data = await res.json();
        console.log(
          "[useChat] Messages fetched:",
          Array.isArray(data) ? data.length : "error",
          data,
        );
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("[useChat] Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeGroupId, socket, isConnected]);

  // 5. Update group name when groups or activeGroupId changes
  useEffect(() => {
    if (!activeGroupId || groups.length === 0) return;
    const currentGroup = groups.find((g) => g._id === activeGroupId);
    if (currentGroup) setGroupName(currentGroup.name);
  }, [activeGroupId, groups]);

  const createGroup = useCallback(
    (name: string, imageUrl?: string) => {
      socket?.emit("create_group", { name, imageUrl });
    },
    [socket],
  );

  const addReaction = useCallback(
    (messageId: string, userId: string, emoji: string) => {
      if (!activeGroupId) return;
      socket?.emit("add_reaction", { messageId, userId, emoji, room: activeGroupId });
    },
    [socket, activeGroupId],
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!activeGroupId) return;
      socket?.emit("edit_message", { messageId, content, room: activeGroupId });
    },
    [socket, activeGroupId],
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!activeGroupId) return;
      socket?.emit("delete_message", { messageId, room: activeGroupId });
    },
    [socket, activeGroupId],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      socket?.emit("delete_group", groupId);
    },
    [socket],
  );

  const updateGroup = useCallback(
    (groupId: string, newName?: string, newImage?: string) => {
      socket?.emit("update_group", { groupId, newName, newImage });
    },
    [socket],
  );

  const sendTyping = useCallback(
    (username: string) => {
      const currentGroupId = activeGroupIdRef.current;
      if (currentGroupId) socket?.emit("typing", username, currentGroupId);
    },
    [socket],
  );

  const sendStopTyping = useCallback(
    (username: string) => {
      const currentGroupId = activeGroupIdRef.current;
      if (currentGroupId) socket?.emit("stop_typing", username, currentGroupId);
    },
    [socket],
  );

  const sendMessage = useCallback(
    (content: string, type: "text" | "image" | "video" = "text") => {
      const currentGroupId = activeGroupIdRef.current;
      const currentSenderId = senderIdRef.current;
      console.log(
        "[useChat] sendMessage called. ref currentGroupId:",
        currentGroupId,
        "ref currentSenderId:",
        currentSenderId?.slice(0, 8),
      );
      if (socket && isConnected && currentGroupId && currentSenderId) {
        console.log("[useChat] Sending message to group:", currentGroupId, "| Content:", content);
        socket.emit("send_message", {
          senderId: currentSenderId,
          groupId: currentGroupId,
          content,
          type,
        });
      } else {
        console.warn(
          "[useChat] Cannot send message. socket:",
          !!socket,
          "connected:",
          isConnected,
          "groupId (from ref):",
          currentGroupId,
          "senderId (from ref):",
          currentSenderId,
        );
      }
    },
    [socket, isConnected],
  );

  return {
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
  };
};
