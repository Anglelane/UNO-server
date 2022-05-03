import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import controllers from './controllers'



const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
  serveClient: false
});

io.on("connection", (socket) => {
  console.log('连接成功')
  Object.keys(controllers).forEach((key: any) => {
    socket.on(key as ClientToServerEventsKeys, (args) => {
      const { type, data } = args;
      const res = controllers[type](data);
      socket.emit(res.type, res)
    });
  })
});

httpServer.listen(3000);
