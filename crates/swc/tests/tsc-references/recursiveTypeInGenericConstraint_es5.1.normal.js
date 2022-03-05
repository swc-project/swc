import * as swcHelpers from "@swc/helpers";
var G = function G() {
    "use strict";
    swcHelpers.classCallCheck(this, G);
};
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var c1 = new Foo(); // ok, circularity in assignment compat check causes success
