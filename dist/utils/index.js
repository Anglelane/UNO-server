"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCoding = void 0;
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
