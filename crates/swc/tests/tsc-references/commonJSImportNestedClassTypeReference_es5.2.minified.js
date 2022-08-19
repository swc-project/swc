require("./mod1").K;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NS = {};
NS.K = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    return _proto.values = function() {
        return new NS.K();
    }, _class;
}(), exports.K = NS.K;
