import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var a;
var b = {
    foo: null
};
// These should all be of type 'any'
var r1 = new C().foo;
var r2 = null.foo;
var r3 = a.foo;
var r4 = b.foo;
