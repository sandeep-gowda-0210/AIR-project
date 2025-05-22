'use client'

import { useState, useEffect } from "react";
import { useUserData } from "../layout"
import RecentChats from "./recent-chats/page";
import ChatWindow from "./chat-window/page";
export default function Chat() {
  
  
  return <div className="flex max-h-[90vh] h-full  w-full justify-center text-5xl text-blue-300 font-extralight">
    <div className="flex w-full h-full">
      <div className="w-[30%]">
        <RecentChats />
      </div>
      <div className=" w-[70%] h-full">
        <ChatWindow />
      </div>
    </div>
  </div>
} 