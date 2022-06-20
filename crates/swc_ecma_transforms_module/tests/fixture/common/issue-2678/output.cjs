"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    default: ()=>someCall,
    test: ()=>test,
    warn: ()=>warn
});
function someCall() {
    throw new Error("this should not be called");
}
function warn() {
    throw new Error("this should not be called");
}
const test = {};
Object.defineProperty(test, "someCall", {
    set: (v)=>{
        someCall = v;
    }
});
Object.defineProperty(test, "warn", {
    get: ()=>warn,
    set: (v)=>{
        warn = v;
    }
});
