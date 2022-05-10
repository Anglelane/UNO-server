"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomInfo = exports.dealCardsToPlayers = exports.dealCards = exports.useCards = exports.updatePlayerListToPlayers = exports.emitAllPlayers = exports.createPlayer = exports.createRoom = exports.roomCollection = void 0;
const card_1 = require("../configs/card");
const utils_1 = require("../utils");
exports.roomCollection = new Map();
function createRoom(args, sc, code) {
    let { roomId, roomName, owner } = args;
    owner = createPlayer(owner, code);
    const newLocal = {
        roomId,
        roomName,
        owner,
        roomCode: code,
        players: [],
        gameCards: [],
        userCards: {},
        order: 0,
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
    return Object.assign(Object.assign({}, userInfo), { socketId, cardNum: 0, lastCard: null });
}
exports.createPlayer = createPlayer;
// 通知指定房间的所有玩家
function emitAllPlayers(io, roomCode, event, data) {
    io.sockets.in(roomCode).emit(event, data);
}
exports.emitAllPlayers = emitAllPlayers;
function updatePlayerListToPlayers(io, roomCode, players, message) {
    emitAllPlayers(io, roomCode, 'UPDATE_PLAYER_LIST', {
        message,
        data: players,
        type: 'UPDATE_PLAYER_LIST'
    });
}
exports.updatePlayerListToPlayers = updatePlayerListToPlayers;
// 生成游戏卡牌
const useCards = () => {
    return (0, utils_1.shuffle)((0, card_1.cardInfomation)());
};
exports.useCards = useCards;
// 获取指定数量的牌
function getSpecifiedCards(cards, num) {
    let res = [];
    for (let i = 0; i < num; i++) {
        if (cards.length < num) {
            // 牌不够了，补牌
            cards = cards.concat((0, exports.useCards)());
        }
        let card = cards.shift();
        res.push(card);
    }
    return res;
}
// 给指定玩家发指定数量的牌
function dealCards(sc, socketId, cards, num) {
    sc.to(socketId).emit('DEAL_CARDS', {
        message: '拿到卡牌',
        data: getSpecifiedCards(cards, num),
        type: 'RES_DEAL_CARDS'
    });
}
exports.dealCards = dealCards;
// 游戏开始，给所有玩家发牌
function dealCardsToPlayers(io, roomCode, roomInfo) {
    io.sockets.in(roomCode).allSockets().then((res) => {
        for (const id of res) {
            io.to(id).emit('GAME_IS_START', {
                message: '游戏开始啦',
                data: {
                    roomInfo,
                    userCards: getSpecifiedCards(roomInfo.gameCards, card_1.InitCardNum)
                },
                type: 'GAME_IS_START'
            });
        }
    });
}
exports.dealCardsToPlayers = dealCardsToPlayers;
function updateRoomInfo(roomInfo) {
    // 生成游戏卡牌
    roomInfo.gameCards = (0, exports.useCards)();
    roomInfo.players.forEach((item) => {
        item.cardNum = card_1.InitCardNum;
        item.lastCard = null;
    });
    roomInfo.createTime = Date.now();
}
exports.updateRoomInfo = updateRoomInfo;
