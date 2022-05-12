"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = exports.randomCoding = void 0;
function randomCoding() {
    let result = [];
    let n = 5; //这个值可以改变的，对应的生成多少个字母，根据自己需求所改
    for (let i = 0; i < n; i++) {
        //生成一个0到25的数字
        let ranNum = Math.ceil(Math.random() * 25);
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;
        //然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
}
exports.randomCoding = randomCoding;
const shuffle = (arr) => {
    let len = arr.length;
    let random;
    while (len !== 0) {
        random = (Math.random() * len--) >>> 0; // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
        [arr[len], arr[random]] = [arr[random], arr[len]]; // ES6的结构赋值实现变量互换
    }
    return arr;
};
exports.shuffle = shuffle;
__exportStar(require("./TaskQueue"), exports);
__exportStar(require("./customCRUD"), exports);
