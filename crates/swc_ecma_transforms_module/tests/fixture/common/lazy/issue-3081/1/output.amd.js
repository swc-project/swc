define([
    "require",
    "exports",
    "child_process"
], function(require, exports, _child_process) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function log() {
        console.log(_child_process.spawn);
    }
    const other = ()=>{
        const nestedClosure = ()=>{
            (0, _child_process.spawn)("ls");
        };
    };
});
