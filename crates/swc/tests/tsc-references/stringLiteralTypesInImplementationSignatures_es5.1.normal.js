import * as swcHelpers from "@swc/helpers";
// String literal types are only valid in overload signatures
function foo(x) {}
var f = function foo(x) {};
var f2 = function(x, y) {};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x) {}
        }
    ]);
    return C;
}();
var a;
var b = {
    foo: function foo(x) {},
    a: function foo(x, y) {},
    b: function(x) {}
};
