import { createRoom, roomCollection } from '../services/room'
import { get, has, set } from '../utils/customCRUD';
const roomControllers = {
  'RES_CREATE_ROOM': (args: any): dataType<any> => {
    const { id, name } = args;
    const key = (id + name);
    if (has(roomCollection, key)) {
      return {
        message: '成功进入房间',
        data: get(roomCollection,key),
        type: 'RES_CREATE_ROOM',
      };
    }
    let data: any;
    set(roomCollection, key, (data = createRoom(args)))
    return {
      message: '房间创建成功',
      data,
      type: 'RES_CREATE_ROOM'
    };
  }
}

export default roomControllers;

