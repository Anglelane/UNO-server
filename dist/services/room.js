"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomInfo = exports.updatePlayerListToPlayers = exports.emitAllPlayers = exports.createPlayer = exports.createRoom = exports.roomCollection = void 0;
const card_1 = require("../configs/card");
const game_1 = require("./game");
exports.roomCollection = new Map();
function createRoom(args, sc, code) {
    let { roomId, roomName, owner } = args;
    owner = createPlayer(owner, sc.id);
    const newLocal = {
        roomId,
        roomName,
        owner,
        roomCode: code,
        players: [],
        gameCards: [],
        userCards: {},
        order: 0,
        lastCard: null,
        winnerOrder: [],
        createTime: Date.now(),
        startTime: -1,
        endTime: -1,
    };
    newLocal.players.push(owner);
    return newLocal;
}
exports.createRoom = createRoom;
// 创建玩家
function createPlayer(userInfo, socketId) {
    return Object.assign(Object.assign({}, userInfo), { socketId, cardNum: 0, cards: null, lastCard: null });
}
exports.createPlayer = createPlayer;
// 通知指定房间的所有玩家
function emitAllPlayers(io, roomCode, event, data) {
    io.sockets.in(roomCode).emit(event, data);
}
exports.emitAllPlayers = emitAllPlayers;
// 更新玩家列表
function updatePlayerListToPlayers(io, roomCode, players, message) {
    emitAllPlayers(io, roomCode, 'UPDATE_PLAYER_LIST', {
        message,
        data: players,
        type: 'UPDATE_PLAYER_LIST'
    });
}
exports.updatePlayerListToPlayers = updatePlayerListToPlayers;
// 更新房间信息
function updateRoomInfo(roomInfo) {
    // 生成游戏卡牌
    roomInfo.gameCards = (0, game_1.useCards)();
    roomInfo.players.forEach((item) => {
        item.cardNum = card_1.InitCardNum;
        item.lastCard = null;
    });
    roomInfo.createTime = Date.now();
}
exports.updateRoomInfo = updateRoomInfo;
