"use strict";
function _childProcess() {
    const data = require("child_process");
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
        _childProcess().spawn("ls");
    };
};
