"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("../services/room");
const customCRUD_1 = require("../utils/customCRUD");
const roomControllers = {
    'RES_CREATE_ROOM': (args) => {
        const { id, name } = args;
        const key = (id + name);
        if ((0, customCRUD_1.has)(room_1.roomCollection, key)) {
            return {
                message: '成功进入房间',
                data: (0, customCRUD_1.get)(room_1.roomCollection, key),
                type: 'RES_CREATE_ROOM',
            };
        }
        let data;
        (0, customCRUD_1.set)(room_1.roomCollection, key, (data = (0, room_1.createRoom)(args)));
        return {
            message: '房间创建成功',
            data,
            type: 'RES_CREATE_ROOM'
        };
    }
};
exports.default = roomControllers;
