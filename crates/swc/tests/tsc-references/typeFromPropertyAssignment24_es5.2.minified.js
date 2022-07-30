var x;
Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
({}).Inner = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.name = function() {
        return "hi";
    }, _class;
}();
