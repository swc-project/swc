"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = someCall;
exports.warn = warn;
exports.test = void 0;
function someCall() {
    throw new Error("this should not be called");
}
function warn() {
    throw new Error("this should not be called");
}
const test = {};
exports.test = test;
Object.defineProperty(exports.test, "someCall", {
    set: (v)=>{
        exports.default = someCall = v;
    }
});
Object.defineProperty(exports.test, "warn", {
    get: ()=>warn
    ,
    set: (v)=>{
        exports.warn = warn = v;
    }
});
