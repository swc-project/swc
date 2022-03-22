import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.x = 1;
    this.y = "hello";
};
var c = new C();
var c2 = new C(null); // error
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.x = 2;
    this.y = null;
};
var d = new D();
var d2 = new D(null); // error
