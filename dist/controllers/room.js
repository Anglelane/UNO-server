"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../services/room");
const utils_1 = require("../utils");
const customCRUD_1 = require("../utils/customCRUD");
const roomControllers = (io) => {
    return {
        'RES_CREATE_ROOM': (args, sc) => {
            const code = (0, utils_1.randomCoding)();
            // 创建频道
            sc.join(code);
            let data;
            (0, customCRUD_1.set)(room_1.roomCollection, code, (data = (0, room_1.createRoom)(args, code)));
            return {
                message: '房间创建成功',
                data,
                type: 'RES_CREATE_ROOM'
            };
        },
        "RES_JOIN_ROOM": (args, sc) => {
            const { roomCode, playerInfo } = args;
            const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
            if (roomInfo) {
                const key = `${playerInfo.id}${playerInfo.name}`;
                roomInfo.players[key] = playerInfo;
                // 加入频道
                sc.join(roomInfo.roomCode);
                return {
                    message: '加入房间成功',
                    data: roomInfo,
                    type: 'RES_JOIN_ROOM'
                };
            }
            return {
                message: '房间不存在',
                data: null,
                type: 'RES_JOIN_ROOM'
            };
        }
    };
};
exports.default = roomControllers;
