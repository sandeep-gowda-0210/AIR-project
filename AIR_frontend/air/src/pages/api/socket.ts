// src/pages/api/socket.ts
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { pushMessage } from "@/services/chatService";

import type { Message } from "@/app/pages/home/chat-page/chat-window/page";
import { getUser } from "@/services/authService";
import { setSocketServer, setUserSocket,getUserSocketMap, removeUserSocket } from "@/utils/socketStore";
import { assert_generate_autoreply, autoReplyOllama } from "@/services/autoReplyService";
type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};


export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("✅ Socket.IO server already running");
    setSocketServer(res.socket.server.io);
    res.end();
    return;
  }

  console.log("🆕 Setting up new Socket.IO server");

  const io = new IOServer(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 20000,
    maxHttpBufferSize: 1e8,
    perMessageDeflate: false,
  });


  io.on("connection", async (socket) => {
    const cookieHeader = socket.handshake.headers.cookie || "";
    // console.log("heeeeeey ", cookieHeader);
    const cookies = parse(cookieHeader);
    const token = cookies['login-token'];
    if (token) {
      const { data, error } = await getUser(token);
      if (data?.length) {
        const { user_id } = data[0];
        setUserSocket(user_id, socket.id);
        console.log(`✅ User ${user_id} connected with socket ${socket.id}`);
        console.log("🔌 New client connected:", socket.id);
        socket.on("send-message", async (message: Message) => {
          console.log(" client connected:", socket.id);
          // console.log("📨 Message received:", message, " from ", socket.id);
          if (!token)
            console.log("Token is not provided");
          if (token) {
            const error = await pushMessage(token, message);
            console.log("error: ",error);
            
            if (error!==null) {
              console.log("Error Occured pushing message", error);
            }
            else {
              // console.log("entered");
              socket.emit("sent-message");
              let receiver_socket_id = getUserSocketMap().get(message.receiver_id)
              
              if (receiver_socket_id)
                io.to(receiver_socket_id).emit("receive-message", message);
              const {data:reply,error:autoGenError} = await assert_generate_autoreply(token, message.sender_id,message.receiver_id,message.content);
              if(autoGenError!==null && reply === null){
                console.log("No reply generated", autoGenError);
                
              }
              if(reply!==null){
                // console.log("Reply generated successfully", reply);
                socket.emit("receive-message",reply);
                if (receiver_socket_id)
                  io.to(receiver_socket_id).emit("receive-message", reply);
              }
                
              }
              // console.log(receiver_socket_id);

          }
        });


        socket.on("disconnect", () => {
          if (user_id) {
            removeUserSocket(user_id);
            console.log(`❌ User ${user_id} disconnected`);
          }
          console.log("❌ Client disconnected:", socket.id);
        });
      } else if (error || !data) {
        console.error("User profile not found ", error);
      }
    } else {
      console.error("Auth error while fetching data");
    }
  });
  res.socket.server.io = io;
  setSocketServer(res.socket.server.io);
  res.end();
}
