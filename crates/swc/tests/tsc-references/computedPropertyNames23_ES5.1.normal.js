//// [computedPropertyNames23_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var C = /*#__PURE__*/ function(_prop) {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[_prop] = function() {};
    return C;
}(_define_property({}, this.bar(), 1)[0]);
