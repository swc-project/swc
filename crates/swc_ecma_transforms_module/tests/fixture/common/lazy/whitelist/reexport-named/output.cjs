"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get named1 () {
        return _white().named1;
    },
    get named2 () {
        return _black.named2;
    }
});
function _white() {
    const data = require("white");
    _white = function() {
        return data;
    };
    return data;
}
const _black = require("black");
