import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket } from "net"; // Importar el tipo Socket de 'net'

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithServer extends Socket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socketWithServer = res.socket as unknown as SocketWithServer;

  if (!socketWithServer.server.io) {
    console.log("Setting up socket.io");
    const io = new IOServer(socketWithServer.server);
    socketWithServer.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connection", socket.id);

      socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
      });
    });
  }
  res.end();
}
