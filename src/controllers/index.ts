import {ServerType, SocketType } from "..";
import roomControllers from "./room";
import userControllers from "./user";

const controllers = {
  ...roomControllers,
  ...userControllers
}

export default controllers;
