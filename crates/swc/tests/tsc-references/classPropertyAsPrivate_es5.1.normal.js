import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "y",
            get: function get() {
                return null;
            },
            set: function set(x) {}
        },
        {
            key: "foo",
            value: function foo() {}
        }
    ], [
        {
            key: "b",
            get: function get() {
                return null;
            },
            set: function set(x) {}
        },
        {
            key: "foo",
            value: function foo() {}
        }
    ]);
    return C;
}();
var c;
// all errors
c.x;
c.y;
c.y = 1;
c.foo();
C.a;
C.b();
C.b = 1;
C.foo();
