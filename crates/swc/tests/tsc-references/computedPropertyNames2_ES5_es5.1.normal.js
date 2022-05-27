import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es5
var methodName = "method";
var accessorName = "accessor";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[methodName] = function() {};
    C[methodName] = function() {};
    _create_class(C, [
        {
            key: accessorName,
            get: function get() {}
        },
        {
            key: accessorName,
            set: function set(v) {}
        }
    ], [
        {
            key: accessorName,
            get: function get() {}
        },
        {
            key: accessorName,
            set: function set(v) {}
        }
    ]);
    return C;
}();
