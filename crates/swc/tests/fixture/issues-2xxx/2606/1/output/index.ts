"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    test: ()=>test,
    test2: ()=>test2,
    warn: ()=>warn
});
function warn() {
    throw new Error("this should not be called");
}
const test = {};
const test2 = {};
Object.defineProperty(test, "warn", {
    get: ()=>warn,
    set: (v)=>{
        warn = v;
    }
});
Object.defineProperty(test2, "work", {
    get: ()=>warn,
    set: (v)=>{
        warn = v;
    }
});
