"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = __importDefault(require("./game"));
const room_1 = __importDefault(require("./room"));
const user_1 = __importDefault(require("./user"));
const controllers = Object.assign(Object.assign(Object.assign({}, room_1.default), user_1.default), game_1.default);
exports.default = controllers;
