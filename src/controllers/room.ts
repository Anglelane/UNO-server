import { ServerType, SocketType } from '..';
import { createRoom, roomCollection } from '../services/room'
import { randomCoding } from '../utils';
import { get, has, set } from '../utils/customCRUD';
const roomControllers = (io: ServerType) => {
  return {
    'RES_CREATE_ROOM': (args: any,sc:SocketType): dataType<any> => {
      const code = randomCoding();
      // 创建频道
      sc.join(code);

      let data: any;
      set(roomCollection, code, (data = createRoom(args, code)))
      return {
        message: '房间创建成功',
        data,
        type: 'RES_CREATE_ROOM'
      };
    },
    "RES_JOIN_ROOM": (args: any,sc:SocketType): dataType<any> => {
      const { roomCode, playerInfo } = args;
      const roomInfo = get(roomCollection, roomCode) as RoomInfo;
      if (roomInfo) {
        const key = `${playerInfo.id}${playerInfo.name}`
        roomInfo.players[key] = playerInfo
        // 加入频道
        sc.join(roomInfo.roomCode);
        return {
          message: '加入房间成功',
          data: roomInfo,
          type: 'RES_JOIN_ROOM'
        }
      }
      return {
        message: '房间不存在',
        data: null,
        type: 'RES_JOIN_ROOM'
      }
    }
  }
}
export default roomControllers;

