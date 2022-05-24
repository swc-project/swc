import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var _iterator = Symbol.iterator, _toPrimitive = Symbol.toPrimitive, _toStringTag = Symbol.toStringTag, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this[_iterator] = 0;
    }
    return C.prototype[_toPrimitive] = function() {}, _create_class(C, [
        {
            key: _toStringTag,
            get: function() {
                return 0;
            }
        }
    ]), C;
}();
