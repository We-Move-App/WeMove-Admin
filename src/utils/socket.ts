// src/utils/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://139.59.20.155:8000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(`${SOCKET_URL}/admin`, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: localStorage.getItem("accessToken"),
      },
    });

    // Debugging events
    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });
  }

  return socket;
};
