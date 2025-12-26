//// [staticIndexSignature7.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    Y.foo = function foo() {}; // should error, incompatible with index signature
    return Y;
}();
