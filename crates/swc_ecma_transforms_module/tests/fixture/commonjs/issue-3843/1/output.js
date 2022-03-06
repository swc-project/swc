"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.callChild = exports.child = void 0;
const child = ()=>{
    console.log("Hello World!");
};
exports.child = child;
const callChild = ()=>{
    exports.child();
};
exports.callChild = callChild;
