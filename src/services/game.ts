import { cardInfomation, InitCardNum } from "../configs/card";
import { shuffle, TaskQueue } from "../utils";
import { ServerType, SocketType } from "..";
import { emitAllPlayers, updateRoomInfoAtEnd } from "./room";

// 生成游戏卡牌
export const useCards = () => {
  return shuffle(cardInfomation())
}

// 获取指定数量的牌
export function getSpecifiedCards(cards: CardInfo[], num: number) {
  let res = [];
  for (let i = 0; i < num; i++) {
    if (cards.length < num) {
      // 牌不够了，补牌
      cards = cards.concat(useCards());
    }
    let card = cards.shift();
    res.push(card);
  }
  return res as CardInfo[];
}
// 给指定玩家发指定数量的牌
export function dealCards(sc: SocketType, socketId: string, cards: CardInfo[], num: number) {
  sc.to(socketId).emit('DEAL_CARDS', {
    message: `获得卡牌 ${num} 张`,
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
      if (player) {
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
  cardsIndex.forEach((i) => {
    const deleteCard = player.cards?.splice(i, 1);
    player.cardNum--;
    player.lastCard = { ...deleteCard![0] };
    roomInfo.lastCard = { ...deleteCard![0] };
  })
  return player.cards;
}

// 通知玩家进入下一轮
export function emitToNextTurn(io: ServerType, roomCode: string, roomInfo: RoomInfo) {
  roomInfo.order = getNextOrder(roomInfo);
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

// 通知玩家游戏结束
export function emitGameOver(roomInfo: RoomInfo, io: ServerType, roomCode: string) {
  updateRoomInfoAtEnd(roomInfo);
  // 通知玩家游戏结束
  emitAllPlayers(io, roomCode, 'GAME_IS_OVER', {
    type: 'GAME_IS_OVER',
    message: '游戏结束',
    data: {
      winnerOrder: roomInfo.winnerOrder,
      endTime: roomInfo.endTime
    }
  });
}

// 检测玩家卡牌
export function checkCards(cards: CardInfo[], cardsIndex: number[], lastCard: CardInfo | null,tasks:TaskQueue,roomInfo:RoomInfo): boolean {
  for (let i = 0; i < cardsIndex.length; i++) {
    const target = cards[cardsIndex[i]];
    if (!checkCard(target, lastCard)) {
      return false;
    }else{
      tasks.addTask(handleCardByType(target,roomInfo));
    }
  }
  return true
}

// 检查单张卡牌
function checkCard(target: CardInfo, lastCard: CardInfo | null): boolean {
  if(!lastCard || isUniversalCard(target)) return true;
  return isSameColor(target,lastCard) || isSameType(target,lastCard);
}

function isSameColor(target: CardInfo, lastCard: CardInfo) {
  return target.color === lastCard.color
}

function isSameType(target: CardInfo, lastCard: CardInfo) {
  return target.type === lastCard.type
}

function isUniversalCard(target:CardInfo){
  return target.type === 'palette' || target.type === 'add-4';
}


function handleCardByType(card:CardInfo,roomInfo:RoomInfo):Function {
  let fn:Function;
  switch (card.type) {
    case 'exchange':
      fn = ()=>{
        roomInfo.playOrder = roomInfo.playOrder === 1 ? -1 : 1
        // TODO 给全部玩家发出通知
      }
      break;
    case 'ban':
      fn = ()=>{
        roomInfo.order = getNextOrder(roomInfo);
        // TODO 给对应玩家发出通知
      }
      break;
    case 'add-2':
      fn = ()=>{}
        // TODO 给对应玩家发出通知
      break;
    case 'add-4':
      fn = ()=>{}
        // TODO 给对应玩家发出通知
      break;
    case 'palette':
      fn = ()=>{}
        // TODO 给对应玩家发出通知
      break;
    default:
      fn = ()=>{}
      break;
  }
  return fn;
}

// 获取下一轮的玩家序号
function getNextOrder(roomInfo: RoomInfo): number {
  return (roomInfo.order + roomInfo.playOrder + roomInfo.players.length) % roomInfo.players.length;
}

