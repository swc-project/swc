"use strict";
function _local() {
    var data = require("./local");
    _local = function() {
        return data;
    };
    return data;
}
function _external() {
    var data = require("external");
    _external = function() {
        return data;
    };
    return data;
}
function use() {
    (0, _local().local)(_external().external);
}
