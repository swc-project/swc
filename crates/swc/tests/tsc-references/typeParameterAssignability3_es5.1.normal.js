import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
function foo(t, u) {
    var a;
    var b;
    t = a; // ok
    a = t; // ok
    b = u; // ok
    u = b; // ok
    t = u; // error
    u = t; // error
}
var C = function C() {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, C);
    this.r = function() {
        _this.t = _this.u; // error
        _this.u = _this.t; // error
    };
};
