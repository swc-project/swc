//// [instanceofOperatorWithInvalidOperands.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    return C;
}();
var x;
// invalid left operand
// the left operand is required to be of type Any, an object type, or a type parameter type
var a1;
var a2;
var a3;
var a4;
var ra1 = _instanceof(a1, x);
var ra2 = _instanceof(a2, x);
var ra3 = _instanceof(a3, x);
var ra4 = _instanceof(a4, x);
var ra5 = _instanceof(0, x);
var ra6 = _instanceof(true, x);
var ra7 = _instanceof('', x);
var ra8 = _instanceof(null, x);
var ra9 = _instanceof(undefined, x);
// invalid right operand
// the right operand to be of type Any or a subtype of the 'Function' interface type
var b1;
var b2;
var b3;
var b4;
var o1;
var o2;
var o3;
var rb1 = _instanceof(x, b1);
var rb2 = _instanceof(x, b2);
var rb3 = _instanceof(x, b3);
var rb4 = _instanceof(x, b4);
var rb5 = _instanceof(x, 0);
var rb6 = _instanceof(x, true);
var rb7 = _instanceof(x, '');
var rb8 = _instanceof(x, o1);
var rb9 = _instanceof(x, o2);
var rb10 = _instanceof(x, o3);
// both operands are invalid
var rc1 = _instanceof('', {});
