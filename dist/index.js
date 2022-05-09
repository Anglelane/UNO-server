"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const controllers_1 = __importDefault(require("./controllers"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    serveClient: false,
});
io.on('connection', (socket) => {
    console.log('连接成功');
    Object.keys(controllers_1.default).forEach((key) => {
        socket.on(key, (args) => {
            console.log(key, ':', args);
            if (args) {
                const { type, data } = args;
                const res = controllers_1.default[type](data, socket, io);
                console.log(type, ':', res);
                socket.emit(res.type, res);
            }
        });
    });
    socket.on('error', (error) => {
        console.error('error:', error);
    });
});
httpServer.listen(3000);
