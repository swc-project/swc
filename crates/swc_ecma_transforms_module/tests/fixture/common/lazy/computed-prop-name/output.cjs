"use strict";
function _libx() {
    var data = require("libx");
    _libx = function() {
        return data;
    };
    return data;
}
function _liby() {
    var data = require("liby");
    _liby = function() {
        return data;
    };
    return data;
}
class F {
    get [_libx().x]() {}
    get y() {
        (0, _liby().y)();
    }
}
