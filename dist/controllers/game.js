"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../services/room");
const customCRUD_1 = require("../utils/customCRUD");
const game_1 = require("../services/game");
const gameControllers = {
    START_GAME: (roomCode, sc, io) => {
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (!roomInfo)
            // 房间code有误
            return {
                message: '房间不存在',
                data: null,
                type: 'RES_START_GAME'
            };
        if (roomInfo.players.length < 2) {
            return {
                message: '当前人数不足两人，无法开始游戏',
                data: null,
                type: 'RES_START_GAME'
            };
        }
        // 更新roomInfo
        (0, room_1.updateRoomInfoAtStart)(roomInfo);
        // 给所有玩家发牌
        (0, game_1.dealCardsToPlayers)(io, roomCode, roomInfo);
        // 进入第一轮
        (0, game_1.emitToNextTurn)(io, roomCode, roomInfo);
        return {
            data: null,
            type: 'RES_START_GAME'
        };
    },
    OUT_OF_THE_CARD: (data, sc, io) => {
        const { roomCode, cardsIndex } = data;
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (!roomInfo)
            return {
                message: '房间不存在',
                data: null,
                type: 'RES_OUT_OF_THE_CARD'
            };
        const player = roomInfo.players.find((item) => item.socketId === sc.id);
        if (!player)
            return {
                message: '玩家不存在',
                data: null,
                type: 'RES_OUT_OF_THE_CARD'
            };
        const lastCard = roomInfo.lastCard;
        // 判断牌的类型，做出操作
        const stauts = (0, game_1.checkCards)(player.cards, cardsIndex, lastCard);
        if (!stauts) {
            // 检测不通过
            return {
                message: '出牌不符合规则，请重新出牌',
                data: null,
                type: 'RES_OUT_OF_THE_CARD'
            };
        }
        // 更新玩家信息
        const res = (0, game_1.updatePlayerCardInfo)(player, cardsIndex, roomInfo);
        if ((res === null || res === void 0 ? void 0 : res.length) === 0) {
            // 有玩家牌全部用完了，则应该结束游戏
            // 更新房间信息
            (0, game_1.emitGameOver)(roomInfo, io, roomCode);
            return {
                message: '恭喜你赢得游戏',
                data: null,
                type: 'RES_OUT_OF_THE_CARD'
            };
        }
        else {
            // 通知所有玩家进入下一轮，更新客户端信息
            (0, game_1.emitToNextTurn)(io, roomCode, roomInfo);
            return {
                message: '出牌成功',
                data: res,
                type: 'RES_OUT_OF_THE_CARD'
            };
        }
    }
};
exports.default = gameControllers;
