"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    console.log(`${socket.id}:连接成功`);
    Object.keys(controllers_1.default).forEach((key) => {
        socket.on(key, (args) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(key, ':', args);
            if (args) {
                const { type, data } = args;
                const res = yield controllers_1.default[type](data, socket, io);
                if (res) {
                    console.log(res.type, ':', res);
                    socket.emit(res.type, res);
                }
            }
        }));
    });
    socket.on('error', (error) => {
        console.error('error:', error);
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id}:断开连接`);
    });
});
httpServer.listen(3000);
