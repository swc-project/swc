//// [computedPropertyNames2_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
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
