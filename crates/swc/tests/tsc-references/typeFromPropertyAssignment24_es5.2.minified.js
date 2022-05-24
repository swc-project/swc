import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
var x, Outer = {};
Outer.Inner = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.name = function() {
        return "hi";
    }, _class;
}();
