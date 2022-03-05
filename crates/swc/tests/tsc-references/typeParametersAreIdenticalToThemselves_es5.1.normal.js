import * as swcHelpers from "@swc/helpers";
function foo1(x) {}
function foo2(x) {}
function foo3(x, y) {
    var inner = function inner(x) {};
    var inner2 = function inner2(x) {};
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo1",
            value: function foo1(x) {}
        },
        {
            key: "foo2",
            value: function foo2(a, x) {}
        },
        {
            key: "foo3",
            value: function foo3(x) {}
        },
        {
            key: "foo4",
            value: function foo4(x) {}
        }
    ]);
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            key: "foo1",
            value: function foo1(x) {}
        },
        {
            key: "foo2",
            value: function foo2(a, x) {}
        },
        {
            key: "foo3",
            value: function foo3(x) {}
        }
    ]);
    return C2;
}();
