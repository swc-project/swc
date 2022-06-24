(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
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
        default: ()=>_default,
        input: ()=>input
    });
    function input(name) {
        return `${name}.md?render`;
    }
    function _default({ name , input: inp ,  }) {
        inp = inp || input(name);
        return {
            input: inp
        };
    }
});
