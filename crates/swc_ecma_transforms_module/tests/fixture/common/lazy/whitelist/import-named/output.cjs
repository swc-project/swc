"use strict";
function _white() {
    const data = require("white");
    _white = function() {
        return data;
    };
    return data;
}
const _black = require("black");
function use1() {
    console.log(_white().foo1);
}
function use2() {
    console.log(_black.foo2);
}
