import roomControllers from "./room";
import userControllers from "./user";

type controllersType = {
  [key in ServerToClientEventsKeys]: (data: any) => dataType<any>
}
const controllers: controllersType = {
  ...roomControllers,
  ...userControllers
}

export default controllers;
