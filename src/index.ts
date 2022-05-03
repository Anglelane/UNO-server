import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import controllers from './controllers'

interface dataType<T> {
  type: ClientToServerEventsKeys,
  data: T
}

interface ServerToClientEvents {
}

export type ClientToServerEventsKeys = keyof ClientToServerEvents

interface ClientToServerEvents {
  CREATE_ROOM: (data: dataType<{ id: string, name: string }>) => void;
}


interface InterServerEvents {
}

interface SocketData {
  name: string;
  age: number;
}

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  serveClient: false
});

io.on("connection", (socket) => {
  console.log('连接成功')
  Object.keys(controllers).forEach((key: any) => {
    socket.on(key as ClientToServerEventsKeys, (args) => {
      const { type, data } = args;
      controllers[type](data)
    });
  })
});

httpServer.listen(3000);
