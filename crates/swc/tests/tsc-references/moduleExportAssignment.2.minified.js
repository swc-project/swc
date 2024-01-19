//// [npmlog.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var npmlog = module.exports = new (function() {
    function EE() {
        _class_call_check(this, EE);
    }
    var _proto = EE.prototype;
    return _proto.on = function(s) {}, EE;
}())();
npmlog.on("hi"), module.exports.on("hi"), npmlog.x = 1, module.exports.y = 2, npmlog.y, module.exports.x;
//// [use.js]
var npmlog = require("./npmlog");
npmlog.x, npmlog.on;
