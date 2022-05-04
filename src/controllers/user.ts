import { ServerType } from '..';
import { createUser, userCollection } from '../services/user'
import { has, set } from '../utils/customCRUD';
const userControllers =(io:ServerType)=> {
  return {
    'RES_CREATE_USER': (args: any): dataType<boolean> => {
      const { id, name } = args;
      const key = (id + name);
      if (has(userCollection, key)) {
        return {
          message: '人员已存在，请重新输入昵称',
          data: false,
          type: 'RES_CREATE_USER'
        };
      }
      let userInfo;
      set(userCollection, key, userInfo = createUser(args))
      return {
        message: '玩家信息创建成功',
        data: userInfo,
        type: 'RES_CREATE_USER'
      };
    }
  }
}

export default userControllers;

