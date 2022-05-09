export const roomCollection = new Map<string, RoomInfo>();

export function createRoom(args: any, code:string): any {
  const { roomId, roomName, owner } = args;
  const newLocal:RoomInfo = {
    roomId,
    roomName,
    owner,
    roomCode: code,
    players: [],
    gameCard: [],
    userCards: {},
    order: [],
    winnerOrder: [],
    createTime: Date.now(),
    startTime: -1,
    endTime: -1,
  };
  newLocal.players.push(owner);
  return newLocal;
}
