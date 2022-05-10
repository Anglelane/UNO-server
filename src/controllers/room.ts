import type { Controllers, ClientRoomKeys } from '~/types/server';
import { ServerType, SocketType } from '..';
import { createPlayer, createRoom, dealCardsToPlayers, emitOtherPlayers, roomCollection, updatePlayerListToPlayers, useCards } from '../services/room';
import { randomCoding } from '../utils';
import { get, set } from '../utils/customCRUD';

const roomControllers: Controllers<ClientRoomKeys, SocketType, ServerType> = {
  CREATE_ROOM: (data, sc, io) => {
    const code = randomCoding();
    // 创建频道
    sc.join(code);

    let roomInfo: any;
    set(roomCollection, code, (roomInfo = createRoom(data, sc, code)));
    return {
      message: '房间创建成功',
      data: roomInfo,
      type: 'RES_CREATE_ROOM',
    };
  },
  JOIN_ROOM: (data, sc, io) => {
    const { roomCode, userInfo } = data;
    const roomInfo = get(roomCollection, roomCode) as RoomInfo;
    if (roomInfo) {
      roomInfo.players.push(createPlayer(userInfo, sc.id));
      // 加入频道
      sc.join(roomCode);
      // 触发其他客户端更新玩家列表
      updatePlayerListToPlayers(io, roomCode, roomInfo.players, '有玩家进入');
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
  START_GAME: (code: string, sc, io) => {
    const roomInfo = roomCollection.get(code)
    if (roomInfo) {
    const genGameCards = useCards()
      // 生成游戏卡牌
      roomInfo.gameCards = genGameCards;
      // 给所有玩家发牌
      dealCardsToPlayers(io, code, genGameCards)
      roomInfo.createTime = Date.now()
      return {
        message: '游戏开始',
        data: null,
        type: 'RES_START_GAME'
      }
    }
    // 房间code有误
    return {
      message: '房间不存在',
      data: {},
      type: 'RES_START_GAME'
    }
  },
  LEAVE_ROOM: (data, sc, io) => {
    const { roomCode: code, userInfo } = data
    const roomInfo = roomCollection.get(code);
    if (roomInfo) {
      const idx = roomInfo.players.findIndex((item) => item.id === userInfo.id && item.name === item.name)
      roomInfo.players = roomInfo.players.splice(idx, 1)
      sc.leave(code);
      updatePlayerListToPlayers(io, code, roomInfo.players, `玩家${userInfo.name}离开房间`)
      return {
        'message': '您已离开房间',
        data: null,
        type: 'RES_LEAVE_ROOM'
      }
    }
    return {
      message: '房间不存在',
      data: {},
      type: 'RES_LEAVE_ROOM'
    }
  },
  DISSOLVE_ROOM: (data, sc, io) => {
    const code = data;
    emitOtherPlayers(io, code, 'RES_DISSOLVE_ROOM', {
      message: '房间已解散',
      data: null,
      type: 'RES_DISSOLVE_ROOM'
    })
    roomCollection.delete(code)
    io.socketsLeave(code);
    return {
      message: '房间已解散',
      data: null,
      type: 'RES_DISSOLVE_ROOM'
    }
  }
};
export default roomControllers;



