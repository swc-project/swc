import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.hi = function() {
        return "Hi!";
    }, _class;
}())().hi();
