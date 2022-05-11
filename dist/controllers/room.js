"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../services/game");
const room_1 = require("../services/room");
const utils_1 = require("../utils");
const customCRUD_1 = require("../utils/customCRUD");
const roomControllers = {
    CREATE_ROOM: (data, sc, io) => {
        const code = (0, utils_1.randomCoding)();
        // 创建频道
        sc.join(code);
        let roomInfo;
        (0, customCRUD_1.set)(room_1.roomCollection, code, (roomInfo = (0, room_1.createRoom)(data, sc, code)));
        return {
            message: '房间创建成功',
            data: roomInfo,
            type: 'RES_CREATE_ROOM',
        };
    },
    JOIN_ROOM: (data, sc, io) => {
        const { roomCode, userInfo } = data;
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (roomInfo) {
            roomInfo.players.push((0, room_1.createPlayer)(userInfo, sc.id));
            // 加入频道
            sc.join(roomCode);
            // 触发其他客户端更新玩家列表
            (0, room_1.updatePlayerListToPlayers)(io, roomCode, roomInfo.players, `玩家${userInfo.name}进入`);
            return {
                message: '加入房间成功',
                data: roomInfo,
                type: 'RES_JOIN_ROOM',
            };
        }
        return {
            message: '房间不存在',
            data: null,
            type: 'RES_JOIN_ROOM',
        };
    },
    LEAVE_ROOM: (data, sc, io) => {
        const { roomCode, userInfo } = data;
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (roomInfo) {
            const idx = roomInfo.players.findIndex((item) => item.socketId === sc.id);
            roomInfo.players = roomInfo.players.splice(idx, 1);
            sc.leave(roomCode);
            (0, room_1.updatePlayerListToPlayers)(io, roomCode, roomInfo.players, `玩家${userInfo.name}离开房间`);
            // 如果轮到该玩家发牌，还原顺序（-1）,重新进入下一轮
            if (roomInfo.status === 'GAMING' && idx === roomInfo.order) {
                roomInfo.order--;
                (0, game_1.emitToNextTurn)(io, roomCode, roomInfo);
            }
            return {
                'message': '您已离开房间',
                data: null,
                type: 'RES_LEAVE_ROOM'
            };
        }
        return {
            message: '房间不存在',
            data: {},
            type: 'RES_LEAVE_ROOM'
        };
    },
    DISSOLVE_ROOM: (data, sc, io) => {
        const code = data;
        (0, room_1.emitAllPlayers)(io, code, 'RES_DISSOLVE_ROOM', {
            message: '房间已解散',
            data: null,
            type: 'RES_DISSOLVE_ROOM'
        });
        (0, customCRUD_1.deleteKey)(room_1.roomCollection, code);
        io.socketsLeave(code);
        return {
            message: '房间已解散',
            data: null,
            type: 'RES_DISSOLVE_ROOM'
        };
    }
};
exports.default = roomControllers;
