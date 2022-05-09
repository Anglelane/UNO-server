"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.userCollection = void 0;
exports.userCollection = new Map();
function createUser(args) {
    const { id, name } = args;
    return {
        id, name,
    };
}
exports.createUser = createUser;
