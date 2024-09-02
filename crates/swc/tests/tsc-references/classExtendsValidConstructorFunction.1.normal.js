//// [classExtendsValidConstructorFunction.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function foo() {}
var x = new foo(); // can be used as a constructor function
var C = /*#__PURE__*/ function(foo) {
    "use strict";
    _inherits(C, foo);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
} // error, cannot extend it though
(foo);
