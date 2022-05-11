import { cardInfomation, InitCardNum } from "../configs/card";
import { shuffle } from "../utils";
import { ServerType, SocketType } from "..";
import { emitAllPlayers } from "./room";

let playOrder = 1;

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
export function dealCardsToPlayers(io: ServerType, roomCode: string, roomInfo: RoomInfo) {
  io.sockets.in(roomCode).allSockets().then((res) => {
    for (const id of res) {
      const player = roomInfo.players.find((p) => p.socketId === id);
      console.log('player:', player)
      if(player){
        const userCards = (player.cards = getSpecifiedCards(roomInfo.gameCards, InitCardNum))
        io.to(id).emit('GAME_IS_START', {
          message: '游戏开始啦',
          data: {
            roomInfo,
            userCards
          },
          type: 'GAME_IS_START'
        })
      }
    }
  })
}

// 更新玩家卡牌信息
export function updatePlayerCardInfo(player: PlayerInfo, cardsIndex: number[], roomInfo: RoomInfo) {
    cardsIndex.forEach((i)=>{
      const deleteCard = player.cards?.splice(i,1);
      player.cardNum--;
      player.lastCard = { ...deleteCard![0] };
      roomInfo.lastCard = { ...deleteCard![0] };
    })
    roomInfo.order = (roomInfo.order + playOrder) % roomInfo.players.length;
    return player.cards;
  }

export function emitToNextTurn(io: ServerType, roomCode: string, roomInfo: RoomInfo) {
  const nextPlayer = roomInfo.players.find((p, i) => i === roomInfo.order);
  if (nextPlayer) {
    emitAllPlayers(io, roomCode, 'NEXT_TURN', {
      message: `轮到玩家${nextPlayer.name}出牌`,
      type: 'NEXT_TURN',
      data: {
        players: roomInfo.players,
        lastCard: roomInfo.lastCard,
        order: roomInfo.order
      }
    })
  }
}
