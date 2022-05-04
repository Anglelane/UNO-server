import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import controllers from './controllers'

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
  serveClient: false
});

export type ServerType = typeof io;
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;

io.on("connection", (socket) => {
  console.log('连接成功');
  Object.keys(controllers).forEach((key: string) => {
    key = key.replace('RES_', '') as ClientToServerEventsKeys;
    socket.on(key as ClientToServerEventsKeys, (args: dataType<any>) => {
      console.log(key, ':', args)
      const { type, data } = args;
      const res = controllers(io)[type](data,socket);
      console.log(type, ':', res)
      socket.emit(res.type, res)
    });
  })
  socket.on('error', (error) => {
    console.error('error:', error)
  })
});


httpServer.listen(3000);
