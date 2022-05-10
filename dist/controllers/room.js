"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        const { roomCode, playerInfo } = data;
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (roomInfo) {
            // const key = `${playerInfo.id}${playerInfo.name}`;
            roomInfo.players.push(Object.assign(Object.assign({}, playerInfo), { socketId: sc.id }));
            // 加入频道
            sc.join(roomCode);
            // 触发其他客户端更新玩家列表
            (0, room_1.updatePlayerListToPlayers)(io, roomCode, roomInfo.players, '有玩家进入');
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
    START_GAME: (code, sc, io) => {
        const genGameCards = (0, room_1.useCards)();
        const roomInfo = room_1.roomCollection.get(code);
        if (roomInfo) {
            // 生成游戏卡牌
            roomInfo.gameCards = genGameCards;
            // 给所有玩家发牌
            (0, room_1.dealCardsToPlayers)(io, code, genGameCards);
            return {
                message: '游戏开始',
                data: null,
                type: 'RES_START_GAME'
            };
        }
        // 房间code有误
        return {
            message: '房间不存在',
            data: {},
            type: 'RES_START_GAME'
        };
    },
    LEAVE_ROOM: (data, sc, io) => {
        const { roomCode: code, userInfo } = data;
        const roomInfo = room_1.roomCollection.get(code);
        if (roomInfo) {
            const idx = roomInfo.players.findIndex((item) => item.id === userInfo.id && item.name === item.name);
            roomInfo.players = roomInfo.players.splice(idx, 1);
            sc.leave(code);
            (0, room_1.updatePlayerListToPlayers)(io, code, roomInfo.players, `玩家${userInfo.name}离开房间`);
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
        (0, room_1.emitOtherPlayers)(io, code, 'RES_DISSOLVE_ROOM', {
            message: '房间已解散',
            data: null,
            type: 'RES_DISSOLVE_ROOM'
        });
        room_1.roomCollection.delete(code);
        io.socketsLeave(code);
        return {
            message: '房间已解散',
            data: null,
            type: 'RES_DISSOLVE_ROOM'
        };
    }
};
exports.default = roomControllers;
