(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        noassign: ()=>noassign,
        warn: ()=>warn,
        errors: ()=>errors,
        addOne: ()=>addOne,
        someFunc: ()=>someFunc,
        test: ()=>test
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
});
