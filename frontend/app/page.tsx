"use client";
import { useEffect, useState } from "react";
import ChatView from "./ChatView";
import { useChat } from "./hooks/use-chat";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const {
    users,
    selectedChatUser,
    selectUser,
    sendMessage,
    connectUser, 
    // userSelected,
  } = useChat(username);

  console.log({ users });

  const router = useRouter();

  useEffect(() => {
    if (window != null) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login"); // redirect to homepage
      }
    }
  }, [router]);

  return (
    <>
      {/* {!userSelected ? ( */}
      {false ? (
        <div className="flex flex-col w-[400px] mx-auto mt-20 gap-4">
          <Input
            placeholder="Enter username..."
            onChange={(e) => setUsername(e.target.value)}
          />
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
