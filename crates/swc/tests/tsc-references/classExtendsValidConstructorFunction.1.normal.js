//// [classExtendsValidConstructorFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
function foo() {}
var x = new foo(); // can be used as a constructor function
var C = /*#__PURE__*/ function(foo) {
    "use strict";
    _inherits(C, foo);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error, cannot extend it though
(foo);
