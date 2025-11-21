"use client"
import { useState } from "react";
import ChatView from "./ChatView";
import { useChat } from "./hooks/use-chat";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Home() {
  const [username, setUsername] = useState("");
  const { users, selectedChatUser, selectUser, sendMessage, connectUser, userSelected } = useChat(username);

  console.log({users})

  return (
    <>
      {!userSelected ? (
        <div className="flex flex-col w-[400px] mx-auto mt-20 gap-4">
          <Input placeholder="Enter username..." onChange={(e) => setUsername(e.target.value)} />
          <Button onClick={connectUser}>Continue</Button>
        </div>
      ) : (
        <ChatView
          users={users}
          selectedChatUser={selectedChatUser}
          onSelectUser={selectUser}
          onSendMessage={sendMessage}
        />
      )}
    </>
  );
}
