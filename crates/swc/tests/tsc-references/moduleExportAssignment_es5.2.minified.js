import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var EE = function() {
    "use strict";
    function EE() {
        _class_call_check(this, EE);
    }
    return EE.prototype.on = function(s) {}, EE;
}(), npmlog = module.exports = new EE();
npmlog.on("hi"), module.exports.on("hi"), npmlog.x = 1, module.exports.y = 2, npmlog.y, module.exports.x;
var npmlog = require("./npmlog");
npmlog.x, npmlog.on;
