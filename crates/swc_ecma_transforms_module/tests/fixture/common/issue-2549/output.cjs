"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export(exports, {
    addOne: function() {
        return addOne;
    },
    errors: function() {
        return errors;
    },
    noassign: function() {
        return noassign;
    },
    someFunc: function() {
        return someFunc;
    },
    test: function() {
        return test;
    },
    warn: function() {
        return warn;
    }
});
function log() {
    console.log("unexported");
}
function noassign() {
    console.log("stub");
}
function warn() {
    throw new Error("this should not be called");
}
const errors = {
    a: 1
};
const addOne = (x)=>`${x + 1}`;
const someFunc = (x)=>`The answer is : ${addOne(x)}`;
const test = {};
Object.defineProperty(test, "log", {
    get: function get() {
        return log;
    },
    set: function set(v) {
        log = v;
    }
});
Object.defineProperty(test, "warn", {
    get: ()=>warn,
    set: (v)=>{
        warn = v;
    }
});
Object.defineProperty(test, "errors", {
    get: ()=>errors,
    set: (v)=>{
        errors = v;
    }
});
