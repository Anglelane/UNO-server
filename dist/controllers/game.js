"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../services/room");
const customCRUD_1 = require("../utils/customCRUD");
const game_1 = require("../services/game");
const utils_1 = require("../utils");
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
        // 新建任务队列
        const tasks = new utils_1.TaskQueue();
        // 判断牌的类型，做出操作
        const stauts = (0, game_1.checkCards)(player.cards, cardsIndex, lastCard, tasks, roomInfo);
        if (!stauts) {
            // 检测不通过
            return {
                message: '出牌不符合规则，请重新出牌',
                data: null,
                type: 'RES_OUT_OF_THE_CARD'
            };
        }
        // 更新玩家信息
        const newPlayerCards = (0, game_1.updatePlayerCardInfo)(player, cardsIndex, roomInfo);
        // 执行所有卡牌任务
        tasks.exec();
        if ((newPlayerCards === null || newPlayerCards === void 0 ? void 0 : newPlayerCards.length) === 0) {
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
                data: newPlayerCards,
                type: 'RES_OUT_OF_THE_CARD'
            };
        }
    },
    'GET_ONE_CARD': (roomCode, sc, io) => {
        var _a;
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (!roomInfo)
            return {
                message: '房间不存在',
                data: null,
                type: 'RES_GET_ONE_CARD'
            };
        const player = roomInfo.players.find((item) => item.socketId === sc.id);
        if (!player)
            return {
                message: '玩家不存在',
                data: null,
                type: 'RES_GET_ONE_CARD'
            };
        const card = (0, game_1.getSpecifiedCards)(roomInfo.gameCards, 1);
        (_a = player.cards) === null || _a === void 0 ? void 0 : _a.push(...card);
        player.cardNum++;
        return {
            data: {
                userCards: player.cards,
                card: card[0]
            },
            type: 'RES_GET_ONE_CARD'
        };
    },
    'NEXT_TURN': (roomCode, sc, io) => {
        const roomInfo = (0, customCRUD_1.get)(room_1.roomCollection, roomCode);
        if (!roomInfo) {
            return {
                message: '房间不存在',
                data: null,
                type: 'RES_NEXT_TURN'
            };
        }
        // 通知所有玩家进入下一轮，更新客户端信息
        (0, game_1.emitToNextTurn)(io, roomCode, roomInfo);
    }
};
exports.default = gameControllers;
