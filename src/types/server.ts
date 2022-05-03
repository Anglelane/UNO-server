declare interface dataType<T> {
  type: ServerToClientEventsKeys,
  data: T
  message?: string
}

declare type ServerToClientEvents = {
  [key in ServerToClientEventsKeys]: any
}

declare type ClientToServerEventsKeys = keyof ClientToServerEvents
declare type ServerToClientEventsKeys = `RES_${ClientToServerEventsKeys}`

declare interface ClientToServerEvents {
  CREATE_ROOM: (data: dataType<{ id: string, name: string }>) => void;
  CREATE_USER: (data: dataType<UserInfo>) => void;
}


declare interface InterServerEvents {
}
