import  type { Controllers, ClientRoomKeys } from '~/types/server';
import { ServerType, SocketType } from '..';
import { createRoom, roomCollection } from '../services/room';
import { randomCoding } from '../utils';
import { get, set } from '../utils/customCRUD';

const roomControllers: Controllers<ClientRoomKeys, SocketType, ServerType> = {
  CREATE_ROOM: (args, sc, io) => {
    const code = randomCoding();
    // 创建频道
    sc.join(code);

    let data: any;
    set(roomCollection, code, (data = createRoom(args, code)));
    return {
      message: '房间创建成功',
      data,
      type: 'RES_CREATE_ROOM',
    };
  },
  JOIN_ROOM: (args, sc, io) => {
    const { roomCode, playerInfo } = args;
    const roomInfo = get(roomCollection, roomCode) as RoomInfo;
    if (roomInfo) {
      // const key = `${playerInfo.id}${playerInfo.name}`;
      roomInfo.players.push(playerInfo);
      // 加入频道
      sc.join(roomCode);
      // 触发其他客户端更新数据
      emitOtherPlayers(sc, roomCode, roomInfo);
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
  START_GAME:(args,sc,io)=>{
    return{
      message:'游戏开始',
      data:{},
      type:'RES_START_GAME'
    }
  }
};
export default roomControllers;

function emitOtherPlayers(sc: SocketType, roomCode: string, roomInfo: RoomInfo) {
  sc.to(roomCode).emit('UPDATE_PLAYER_LIST', roomInfo.players as never);
}
