"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _child_process() {
    const data = require("child_process");
    _child_process = function() {
        return data;
    };
    return data;
}
function log() {
    console.log(_child_process().spawn);
}
const other = ()=>{
    const nestedClosure = ()=>{
        (0, _child_process().spawn)("ls");
    };
};
