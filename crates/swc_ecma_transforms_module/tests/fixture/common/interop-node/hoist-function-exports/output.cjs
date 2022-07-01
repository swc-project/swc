"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nextOdd = exports.isOdd = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isOdd: ()=>isOdd,
    nextOdd: ()=>nextOdd
});
const _evens = require("./evens");
function nextOdd(n) {
    return (0, _evens.isEven)(n) ? n + 1 : n + 2;
}
var isOdd = function(isEven) {
    return function(n) {
        return !isEven(n);
    };
}(_evens.isEven);
