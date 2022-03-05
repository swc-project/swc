import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x, y) {}
        },
        {
            key: "bar",
            value: function bar(x, y) {}
        },
        {
            key: "baz",
            value: function baz(x, y) {}
        }
    ], [
        {
            key: "foo",
            value: function foo(x, y) {}
        },
        {
            key: "bar",
            value: function bar(x, y) {}
        },
        {
            key: "baz",
            value: function baz(x, y) {}
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function foo(x, y) {}
        },
        {
            key: "bar",
            value: function bar(x, y) {}
        },
        {
            key: "baz",
            value: function baz(x, y) {}
        }
    ], [
        {
            key: "foo",
            value: function foo(x, y) {}
        },
        {
            key: "bar",
            value: function bar(x, y) {}
        },
        {
            key: "baz",
            value: function baz(x, y) {}
        }
    ]);
    return D;
}();
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
