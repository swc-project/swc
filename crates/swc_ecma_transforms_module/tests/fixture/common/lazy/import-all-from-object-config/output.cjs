"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _local() {
    const data = require("./local");
    _local = function() {
        return data;
    };
    return data;
}
function _external() {
    const data = require("external");
    _external = function() {
        return data;
    };
    return data;
}
function use() {
    (0, _local().local)(_external().external);
}
