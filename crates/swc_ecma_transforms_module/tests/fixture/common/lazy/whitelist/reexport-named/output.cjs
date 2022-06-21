"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    named1: ()=>_white().named1,
    named2: ()=>_black.named2
});
function _white() {
    var data = require("white");
    _white = function() {
        return data;
    };
    return data;
}
var _black = require("black");
