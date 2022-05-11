import type { ClientGameKeys, ClientRoomKeys, ClientUserKeys, Controllers } from '~/types/server';
import { ServerType, SocketType } from '..';
import gameControllers from './game';
import roomControllers from './room';
import userControllers from './user';

const controllers:Controllers<ClientRoomKeys | ClientUserKeys | ClientGameKeys, SocketType, ServerType> = {
  ...roomControllers,
  ...userControllers,
  ...gameControllers
};

export default controllers;
