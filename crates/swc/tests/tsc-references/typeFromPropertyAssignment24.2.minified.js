//// [usage.js]
Outer.Inner.Message = function() {};
var x, y = new Outer.Inner();
y.name, x.name;
//// [def.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Outer = {};
Outer.Inner = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.name = function() {
        return "hi";
    }, _class;
}();
