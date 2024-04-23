//// [computedPropertyNames32_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {
    return '';
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[foo()] = function() {};
    return C;
}();
