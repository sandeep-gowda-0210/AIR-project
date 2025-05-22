import { io } from "socket.io-client";

const socket = io("http://localhost:3000",{
  path: "/api/socket",
  transports: ["websocket"],
  autoConnect:false
});

export default socket;