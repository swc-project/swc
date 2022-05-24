import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: usage.js
// note that usage is first in the compilation
Outer.Inner.Message = function() {};
var y = new Outer.Inner();
y.name;
/** @type {Outer.Inner} should be instance type, not static type */ var x;
x.name;
// @Filename: def.js
var Outer = {};
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.name = function name() {
        return "hi";
    };
    return _class;
}();
