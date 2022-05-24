import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag;
//@target: ES6
//@declaration: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: _toPrimitive,
            get: function get() {
                return "";
            }
        },
        {
            key: _toStringTag,
            set: function set(x) {}
        }
    ]);
    return C;
}();
