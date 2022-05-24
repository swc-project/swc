import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es6
var methodName = "method";
var accessorName = "accessor";
var _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[_methodName] = function() {};
    C[_methodName1] = function() {};
    _create_class(C, [
        {
            key: _accessorName,
            get: function get() {}
        },
        {
            key: _accessorName1,
            set: function set(v) {}
        }
    ], [
        {
            key: _accessorName2,
            get: function get() {}
        },
        {
            key: _accessorName3,
            set: function set(v) {}
        }
    ]);
    return C;
}();
