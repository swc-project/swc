import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.hi = function hi() {
        return "Hi!";
    };
    return _class;
}())().hi();
