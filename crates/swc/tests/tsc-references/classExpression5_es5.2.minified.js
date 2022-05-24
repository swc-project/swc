import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
new (function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.hi = function() {
        return "Hi!";
    }, _class;
}())().hi();
