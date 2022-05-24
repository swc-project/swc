"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warn = warn;
exports.test2 = exports.test = void 0;
function warn() {
    throw new Error("this should not be called");
}
const test = {};
exports.test = test;
const test2 = {};
exports.test2 = test2;
Object.defineProperty(test, "warn", {
    get: ()=>warn,
    set: (v)=>{
        exports.warn = warn = v;
    }
});
Object.defineProperty(test2, "work", {
    get: ()=>warn,
    set: (v)=>{
        exports.warn = warn = v;
    }
});
