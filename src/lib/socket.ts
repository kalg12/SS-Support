import { Server as IOServer } from "socket.io";

let io: IOServer | undefined;

export const initializeSocket = (server: any) => {
  if (!io) {
    io = new IOServer(server, {
      path: "/api/socket",
    });
    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);
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
