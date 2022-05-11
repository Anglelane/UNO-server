import { roomCollection, updateRoomInfoAtStart } from '../services/room';
import type { Controllers, ClientGameKeys } from '~/types/server';
import { ServerType, SocketType } from '..';
import { get } from '../utils/customCRUD';
import { dealCardsToPlayers, emitGameOver, emitToNextTurn, updatePlayerCardInfo } from '../services/game';

const gameControllers: Controllers<ClientGameKeys, SocketType, ServerType> = {
  START_GAME: (roomCode: string, sc, io) => {
    const roomInfo = get(roomCollection, roomCode)
    if (roomInfo) {
      if(roomInfo.players.length < 2){
        return{
          message: '当前人数不足两人，无法开始游戏',
          data: null,
          type: 'RES_START_GAME'
        }
      }
      // 更新roomInfo
      updateRoomInfoAtStart(roomInfo)
      // 给所有玩家发牌
      dealCardsToPlayers(io, roomCode, roomInfo)
      // 进入第一轮
      emitToNextTurn(io, roomCode, roomInfo);
    }
    // 房间code有误
    return {
      message: '房间不存在',
      data: null,
      type: 'RES_START_GAME'
    }
  },
  OUT_OF_THE_CARD: (data, sc, io) => {
    const { roomCode, cardsIndex } = data
    const roomInfo = get(roomCollection, roomCode);
    if (roomInfo) {
      // 判断牌的类型，做出操作
      // TODO
      // 更新玩家信息
      const player = roomInfo.players.find((item) => item.socketId === sc.id);
      if (player) {
        const res = updatePlayerCardInfo(player, cardsIndex, roomInfo)
        if (res?.length === 0) {
          // 有玩家牌全部用完了，则应该结束游戏
          // 更新房间信息
          emitGameOver(roomInfo, io, roomCode);
          return {
            message: '恭喜你赢得游戏',
            data: null,
            type: 'RES_OUT_OF_THE_CARD'
          }
        } else {
          // 通知所有玩家进入下一轮，更新客户端信息
          emitToNextTurn(io, roomCode, roomInfo);
          return {
            message: '出牌成功',
            data: res,
            type: 'RES_OUT_OF_THE_CARD'
          }
        }
      }
      return {
        message: '玩家不存在',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
    }
    return {
      message: '房间不存在',
      data: null,
      type: 'RES_OUT_OF_THE_CARD'
    }
  }
};

export default gameControllers;




