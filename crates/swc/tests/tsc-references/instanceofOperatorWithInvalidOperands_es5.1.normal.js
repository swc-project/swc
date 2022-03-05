import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {}
        }
    ]);
    return C;
}();
var x;
// invalid left operand
// the left operand is required to be of type Any, an object type, or a type parameter type
var a1;
var a2;
var a3;
var a4;
var ra1 = swcHelpers._instanceof(a1, x);
var ra2 = swcHelpers._instanceof(a2, x);
var ra3 = swcHelpers._instanceof(a3, x);
var ra4 = swcHelpers._instanceof(a4, x);
var ra5 = swcHelpers._instanceof(0, x);
var ra6 = swcHelpers._instanceof(true, x);
var ra7 = swcHelpers._instanceof('', x);
var ra8 = swcHelpers._instanceof(null, x);
var ra9 = swcHelpers._instanceof(undefined, x);
// invalid right operand
// the right operand to be of type Any or a subtype of the 'Function' interface type
var b1;
var b2;
var b3;
var b4;
var o1;
var o2;
var o3;
var rb1 = swcHelpers._instanceof(x, b1);
var rb2 = swcHelpers._instanceof(x, b2);
var rb3 = swcHelpers._instanceof(x, b3);
var rb4 = swcHelpers._instanceof(x, b4);
var rb5 = swcHelpers._instanceof(x, 0);
var rb6 = swcHelpers._instanceof(x, true);
var rb7 = swcHelpers._instanceof(x, '');
var rb8 = swcHelpers._instanceof(x, o1);
var rb9 = swcHelpers._instanceof(x, o2);
var rb10 = swcHelpers._instanceof(x, o3);
// both operands are invalid
var rc1 = swcHelpers._instanceof('', {});
