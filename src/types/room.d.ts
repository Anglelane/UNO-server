declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare interface PlayerInfo extends UserInfo {
  socketId:string
}

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCards: CardProps[];
  userCards: {
    [key: string]: CardProps[]
  };
  players:PlayerInfo[];
  order: string[];
  winnerOrder: string[];
  createTime: number;
  startTime: number;
  endTime: number;
}
