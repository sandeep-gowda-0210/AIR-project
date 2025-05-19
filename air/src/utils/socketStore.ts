// lib/socketStore.ts
import { Server as IOServer } from "socket.io";

let ioInstance: IOServer | undefined = undefined;
const userSocketMap = new Map<string, string>(); // user_id -> socket.id

export function setSocketServer(io: IOServer) {
  ioInstance = io;
}

export function getSocketServer() {
  return ioInstance;
}

export function getUserSocketMap() {
  return userSocketMap;
}

export function setUserSocket(userId: string, socketId: string) {
  userSocketMap.set(userId, socketId);
}

export function removeUserSocket(userId: string) {
  userSocketMap.delete(userId);
}
