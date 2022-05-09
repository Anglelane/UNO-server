"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKey = exports.set = exports.get = exports.has = void 0;
const has = (container, key) => {
    return container.has(key);
};
exports.has = has;
const get = (container, key) => {
    return container.get(key);
};
exports.get = get;
const set = (container, key, value) => {
    container.set(key, value);
};
exports.set = set;
const deleteKey = (container, key) => {
    return container.delete(key);
};
exports.deleteKey = deleteKey;
