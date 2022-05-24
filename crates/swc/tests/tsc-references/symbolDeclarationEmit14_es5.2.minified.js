import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: _toPrimitive,
            get: function() {
                return "";
            }
        },
        {
            key: _toStringTag,
            get: function() {
                return "";
            }
        }
    ]), C;
}();
