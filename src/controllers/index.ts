import type { ClientRoomKeys, ClientUserKeys, Controllers } from '~/types/server';
import { ServerType, SocketType } from '..';
import roomControllers from './room';
import userControllers from './user';

const controllers:Controllers<ClientRoomKeys | ClientUserKeys, SocketType, ServerType> = {
  ...roomControllers,
  ...userControllers,
};

export default controllers;
