import * as swcHelpers from "@swc/helpers";
function foo(x) {}
var c, i, a, f = function(x) {}, f2 = function(x, y) {};
foo(1), foo(), f(1), f(), f2(1), f2(1, 2);
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}();
c.foo(), c.foo(1), i(), i(1), i.foo(1), i.foo(1, 2), a(), a(1), a.foo(), a.foo(1);
