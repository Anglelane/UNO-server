"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../services/user");
const customCRUD_1 = require("../utils/customCRUD");
const userControllers = {
    CREATE_USER: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, name } = args;
        const key = (id + name);
        if ((0, customCRUD_1.has)(user_1.userCollection, key)) {
            return {
                message: '人员已存在，请重新输入昵称',
                data: false,
                type: 'RES_CREATE_USER',
            };
        }
        let userInfo;
        (0, customCRUD_1.set)(user_1.userCollection, key, userInfo = (0, user_1.createUser)(args));
        return {
            message: '玩家信息创建成功',
            data: userInfo,
            type: 'RES_CREATE_USER',
        };
    }),
};
exports.default = userControllers;
