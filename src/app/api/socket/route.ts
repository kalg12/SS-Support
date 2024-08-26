import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";
import { Socket } from "net";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket) {
    const socket = res.socket as any;
    const server: SocketServer = socket.server;

    if (!server.io) {
      console.log("Initializing Socket.IO...");
      const io = new IOServer(server, {
        path: "/api/socket", // Asegúrate de que el path es correcto
      });
      server.io = io;

      io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        socket.on("disconnect", () => {
          console.log("Client disconnected", socket.id);
        });
      });
    }
  }

  res.end();
}
