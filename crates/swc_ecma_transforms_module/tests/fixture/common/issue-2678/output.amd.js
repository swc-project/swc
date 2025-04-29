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
        get default () {
            return someCall;
        },
        get test () {
            return test;
        },
        get warn () {
            return warn;
        }
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
});
