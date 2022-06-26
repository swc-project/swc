import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
