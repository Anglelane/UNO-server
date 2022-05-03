import { ClientToServerEventsKeys } from "..";
import roomControllers from "./room";

type controllersType = {
  [key in ClientToServerEventsKeys]: Function
}
const controllers: controllersType = {
  ...roomControllers
}

export default controllers;
