"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
class TaskQueue {
    constructor() {
        this.tasks = [];
    }
    addTask(fn) {
        if (typeof fn !== 'function')
            return;
        this.tasks.push(fn);
    }
    exec() {
        const len = this.tasks.length;
        for (let i = 0; i < len; i++) {
            const task = this.tasks.shift();
            task && task();
        }
    }
}
exports.TaskQueue = TaskQueue;
