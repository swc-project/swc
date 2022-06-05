"use strict";
var _exports = {};
__export(_exports, {
    default: function() {
        return someCall;
    },
    test: function() {
        return test;
    },
    warn: function() {
        return warn;
    }
});
module.exports = __toCJS(_exports);
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
