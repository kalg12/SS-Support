import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

// Definir un tipo que extiende la propiedad server en res.socket
type SocketServerResponse = NextApiResponse & {
  socket: {
    server: any; // Cambia 'any' al tipo correcto si conoces el tipo específico
  };
};

export default function handler(
  req: NextApiRequest,
  res: SocketServerResponse
) {
  if (!res.socket.server.io) {
    console.log("Inicializando Socket.IO...");

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Usuario conectado", socket.id);

      socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
      });
    });
  } else {
    console.log("Socket.IO ya está inicializado.");
  }

  res.end();
}
