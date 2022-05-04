export const roomCollection = new Map<string,RoomInfo>();

export function createRoom(args: any,code:string): any {
  const { roomId, roomName, owner } = args
  const newLocal = {
    roomId,
    roomName,
    owner,
    roomCode:code,
    players:{},
    gameCard: [],
    userCards: {},
    order: [],
    winnerOrder: [],
    createTime: Date.now(),
    startTime: '',
    endTime: ''
  };
  return newLocal
}

