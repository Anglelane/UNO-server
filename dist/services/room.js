"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = exports.roomCollection = void 0;
exports.roomCollection = new Map();
function createRoom(args, code) {
    const { roomId, roomName, owner } = args;
    const newLocal = {
        roomId,
        roomName,
        owner,
        roomCode: code,
        players: [],
        gameCard: [],
        userCards: {},
        order: [],
        winnerOrder: [],
        createTime: Date.now(),
        startTime: -1,
        endTime: -1,
    };
    newLocal.players.push(owner);
    return newLocal;
}
exports.createRoom = createRoom;
