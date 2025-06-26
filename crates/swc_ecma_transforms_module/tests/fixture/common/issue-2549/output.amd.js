define([
    "require",
    "exports"
], function(require, exports) {
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
        get addOne () {
            return addOne;
        },
        get errors () {
            return errors;
        },
        get noassign () {
            return noassign;
        },
        get someFunc () {
            return someFunc;
        },
        get test () {
            return test;
        },
        get warn () {
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
});
