"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { socket } from "./use-socket-connection";
import { Socket } from "socket.io-client";

export interface IMessage {
  content: string;
  fromSelf: boolean;
}

export interface IUser {
  userID: string;
  username: string;
  self: boolean;
  messages: IMessage[];
  hasNewMessages: boolean;
  connected?: boolean;
}

export function useChat(username: string) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSelected, setUserSelected] = useState(false);

  const selectedChatUser = useMemo(
    () => users.find((u) => u.userID === selectedUserId) || null,
    [users, selectedUserId]
  );

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    connectUser()
    socket.on("connect", () => {
      console.log("Connecting")
      setUsers((prev) =>
        prev.map((u) => (u.self ? { ...u, connected: true } : u))
      );
    });

    socket.on("disconnect", () => {
      setUsers((prev) =>
        prev.map((u) => (u.self ? { ...u, connected: false } : u))
      );
    });

    socket.on("connect_error", (err) => {
      console.log({ err });
      if (err.message === "invalid username") {
        setUsers((prev) =>
          prev.map((u) => (u.self ? { ...u, connected: false } : u))
        );
      }
    });

    socket.on("users", (list: IUser[]) => {
      const formatted = list
        .map((u) => ({
          ...u,
          self: u.userID === socket.id,
          messages: [],
          hasNewMessages: false,
        }))
        .sort((a, b) =>
          a.self ? -1 : b.self ? 1 : a.username.localeCompare(b.username)
        );

      setUsers(formatted);
    });

    socket.on("user connected", (user: IUser) => {
      setUsers(prev => {
        const exists = prev.some(u => u.userID === user.userID);

        if (exists) {
          // Update the existing user
          return prev.map(u =>
            u.userID === user.userID
              ? { ...u, connected: true }
              : u
          );
        }

        // Otherwise add new user
        return [
          ...prev,
          { ...user, messages: [], hasNewMessages: false, connected: true }
        ];
      });
    });

    return () => {
      console.log("unmounting");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    console.log("Selected user:", selectedUserId);

    socket.on("private message", ({ content, from }) => {
      console.log({ content, from });
      setUsers((prev) =>
        prev.map((user) =>
          user.userID === from
            ? {
              ...user,
              messages: [...user.messages, { content, fromSelf: false }],
              hasNewMessages: user.userID !== selectedUserId,
            }
          : user
        )
      );
    });

    // You can fetch messages here or mark read state
  }, [selectedUserId]);

  const connectUser = () => {
    if (socket) {
      let token = localStorage.getItem("token")
      socket.auth = { token };
      socket.connect();
      console.log("Connecting", username, socket);
      setUserSelected(true);
      socketRef.current = socket;
    }
  };

  const selectUser = (userID: string) => {
    setSelectedUserId(userID);
    setUsers((prev) =>
      prev.map((u) =>
        u.userID === userID ? { ...u, hasNewMessages: false } : u
      )
    );
  };

  const sendMessage = (message: string) => {
    console.log({ selectedChatUser });
    if (!selectedChatUser || !socketRef.current) return;
    console.log("SENDING MESSAGE", {
      message,
      user: selectedChatUser.userID,
      socket: socket,
    });
    socketRef.current.emit("private message", {
      content: message,
      to: selectedChatUser.userID,
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.userID === selectedChatUser.userID
          ? {
            ...u,
            messages: [...u.messages, { content: message, fromSelf: true }],
          }
          : u
      )
    );
  };

  return {
    users,
    selectedChatUser,
    selectUser,
    sendMessage,
    connectUser,
    userSelected,
  };
}
