export const roomCollection = new Map();

export function createRoom(args: any): any {
  const { id, name, owner } = args
  return {
    roomId: id, // 房间id
    roomName: name, // 房间名称 
    owner, // 房主信息
    gameCard: [], // 游戏卡牌
    userCards: {}, // 玩家手牌
    order:[], // 出牌顺序
    winnerOrder:[], // 赢家顺序
    createTime: Date.now(), // 创建时间
    startTime:'', // 开始时间
    endTime: '' // 结束时间
  }
}

