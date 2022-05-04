export const roomCollection = new Map();

export function createRoom(args: any): any {
  const { id, name, owner } = args
  const newLocal = {
    roomId: id,
    roomName: name,
    owner,
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

