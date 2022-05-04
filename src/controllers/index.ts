import { ServerType } from "..";
import roomControllers from "./room";
import userControllers from "./user";


const controllers: (io: ServerType) => controllersType = (io: ServerType) => {
  return {
    ...roomControllers(io),
    ...userControllers(io)
  }
}

export default controllers;
