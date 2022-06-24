"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _libx() {
    const data = require("libx");
    _libx = function() {
        return data;
    };
    return data;
}
function _liby() {
    const data = require("liby");
    _liby = function() {
        return data;
    };
    return data;
}
class F {
    get [_libx().x]() {}
    get y() {
        _liby().y();
    }
}
