"use strict";
var _childProcess = require("child_process");
function log() {
    console.log(_childProcess.spawn);
}
const other = ()=>{
    const nestedClosure = ()=>{
        (0, _childProcess.spawn)("ls");
    };
};
