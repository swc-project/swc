define([
    "require",
    "child_process"
], function(require, _childProcess) {
    "use strict";
    function log() {
        console.log(_childProcess.spawn);
    }
    const other = ()=>{
        const nestedClosure = ()=>{
            (0, _childProcess.spawn)("ls");
        };
    };
});
