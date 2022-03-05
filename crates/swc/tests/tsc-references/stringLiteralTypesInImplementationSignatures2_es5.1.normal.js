import * as swcHelpers from "@swc/helpers";
function foo(x) {}
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
var b = swcHelpers.defineProperty({
    foo: function foo(x) {}
}, "foo", function foo(x) {});
