// src/lib/socket.ts
import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";

let io: IOServer | undefined;

export const initializeSocket = (server: HTTPServer) => {
  if (!io) {
    io = new IOServer(server);
    io.on("connection", (socket) => {
      console.log("New socket connection", socket.id);
    });
  }
  return io;
};

export const getSocketServerInstance = () => {
  if (!io) {
    throw new Error("Socket.IO server instance has not been initialized.");
  }
  return io;
};
