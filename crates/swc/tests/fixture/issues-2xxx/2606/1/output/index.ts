"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get test () {
        return test;
    },
    get test2 () {
        return test2;
    },
    get warn () {
        return warn;
    }
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
