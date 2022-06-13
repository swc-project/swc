import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.method = function() {}, Base;
}();
