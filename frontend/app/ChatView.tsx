

"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUser, IMessage } from "./hooks/use-chat";

interface Props {
  users: IUser[];
  selectedChatUser: IUser | null;
  onSelectUser: (id: string) => void;
  onSendMessage: (msg: string) => void;
}

export default function ChatView({
  users,
  selectedChatUser,
  onSelectUser,
  onSendMessage,
}: Props) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 border-r border-gray-300">
        <div className="p-4 font-bold bg-indigo-600 text-white">Chat App</div>
        <div className="overflow-y-auto p-3">
          {users.map((u) => (
            <div
              key={u.userID}
              onClick={() => onSelectUser(u.userID)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className={`w-3 h-3 rounded-full ${u.connected ? "bg-green-500" : "bg-gray-400"} mr-2`} />
              <span className={u.hasNewMessages ? "font-bold" : ""}>{u.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 font-semibold border-b">{selectedChatUser?.username || "Select a user"}</div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {selectedChatUser?.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.fromSelf ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button className="ml-2" onClick={() => { onSendMessage(message); setMessage("") }}>Send</Button>
        </div>
      </div>
    </div>
  );
}
