import * as swcHelpers from "@swc/helpers";
// Duplicate parameter names are always an error
function foo(x, x) {}
var f = function foo(x, x) {};
var f2 = function f2(x, x) {};
var f3 = function(x, x) {};
var f4 = function(x, x) {};
function foo2(x, x) {}
var f5 = function foo(x, x) {};
var f6 = function f6(x, x) {};
var f7 = function(x, x) {};
var f8 = function(x, y) {};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x, x) {}
        },
        {
            key: "foo2",
            value: function foo2(x, x) {}
        },
        {
            key: "foo3",
            value: function foo3(x, x) {}
        }
    ]);
    return C;
}();
var a;
var b = {
    foo: function foo(x, x) {},
    a: function foo(x, x) {},
    b: function(x, x) {}
};
