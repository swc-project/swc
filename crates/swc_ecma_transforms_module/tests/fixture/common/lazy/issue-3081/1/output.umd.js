(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("child_process"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "child_process"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.childProcess);
})(this, function(exports, _childProcess) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function log() {
        console.log(_childProcess.spawn);
    }
    const other = ()=>{
        const nestedClosure = ()=>{
            (0, _childProcess.spawn)("ls");
        };
    };
});
