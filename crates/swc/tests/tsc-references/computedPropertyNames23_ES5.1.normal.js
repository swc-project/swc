//// [computedPropertyNames23_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
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
