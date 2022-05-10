import { cardInfomation } from "../configs/card";
import { shuffle } from "../utils";
import type { ServerType, SocketType } from "..";
import type { ServerDataType, ServerKeys } from "~/types/server";

export const roomCollection = new Map<string, RoomInfo>();

export function createRoom(args: any, sc: SocketType, code: string): any {
  let { roomId, roomName, owner } = args;
  owner = createPlayer(owner,code);
  const newLocal: RoomInfo = {
    roomId,
    roomName,
    owner,
    roomCode: code,
    players: [],
    gameCards: [],
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

// 创建玩家
export function createPlayer(userInfo: UserInfo, socketId: string): PlayerInfo {
  return {
    ...userInfo,
    socketId,
    cardNum: 0,
    lastCard: null
  }
}

// 通知指定房间的所有玩家
export function emitOtherPlayers(io: ServerType, roomCode: string, event: ServerKeys, data: ServerDataType<typeof event, any>) {
  io.sockets.in(roomCode).emit(event, data as any)
}

export function updatePlayerListToPlayers(io: ServerType, roomCode: string, players: PlayerInfo[], message: string) {
  emitOtherPlayers(io, roomCode, 'UPDATE_PLAYER_LIST', {
    message,
    data: players,
    type: 'UPDATE_PLAYER_LIST'
  })
}

// 生成游戏卡牌
export const useCards = () => {
  return shuffle(cardInfomation())
}

// 获取指定数量的牌
function getSpecifiedCards(cards: CardProps[], num: number) {
  let res = [];
  for (let i = 0; i < num; i++) {
    if (cards.length < num) {
      // 牌不够了，补牌
      cards = cards.concat(useCards());
    }
    let card = cards.shift();
    res.push(card);
  }
  return res as CardProps[];
}
// 给指定玩家发指定数量的牌
export function dealCards(sc: SocketType, socketId: string, cards: CardProps[], num: number) {
  sc.to(socketId).emit('DEAL_CARDS', {
    message: '拿到卡牌',
    data: getSpecifiedCards(cards, num),
    type: 'RES_DEAL_CARDS'
  })
}

// 游戏开始，给所有玩家发牌
export function dealCardsToPlayers(io: ServerType, roomCode: string, gameCards: CardProps[]) {
  io.sockets.in(roomCode).allSockets().then((res) => {
    for (const id of res) {
      io.to(id).emit('GAME_IS_START', {
        message: '游戏开始啦',
        data: {
          userCards: getSpecifiedCards(gameCards, 7)
        },
        type: 'GAME_IS_START'
      })
    }
  })
}
