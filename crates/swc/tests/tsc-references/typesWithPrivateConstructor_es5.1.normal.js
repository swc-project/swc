import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var c = new C(); // error C is private
var r = c.constructor;
var C2 = function C2(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
var c2 = new C2(); // error C2 is private
var r2 = c2.constructor;
