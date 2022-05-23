"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warn = warn;
exports.default = exports.test = void 0;
function someCall() {
    throw new Error("this should not be called");
}
function warn() {
    throw new Error("this should not be called");
}
const test = {};
exports.test = test;
Object.defineProperty(test, "someCall", {
    set: (v)=>{
        someCall = v;
    }
});
Object.defineProperty(test, "warn", {
    get: ()=>warn
    ,
    set: (v)=>{
        exports.warn = warn = v;
    }
});
var _default = someCall;
exports.default = _default;
