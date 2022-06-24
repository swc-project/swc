define([
    "exports",
    "child_process"
], function(exports, _childProcess) {
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
