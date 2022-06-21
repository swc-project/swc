"use strict";
function _childProcess() {
    var data = require("child_process");
    _childProcess = function() {
        return data;
    };
    return data;
}
function log() {
    console.log(_childProcess().spawn);
}
const other = ()=>{
    const nestedClosure = ()=>{
        (0, _childProcess().spawn)("ls");
    };
};
