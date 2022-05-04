"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("./room"));
const user_1 = __importDefault(require("./user"));
const controllers = (io) => {
    return Object.assign(Object.assign({}, (0, room_1.default)(io)), (0, user_1.default)(io));
};
exports.default = controllers;
