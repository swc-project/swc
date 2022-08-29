//// [computedPropertyNamesOnOverloads_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var methodName = "method";
var accessorName = "accessor";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[methodName] = function(v) {};
    return C;
}();
