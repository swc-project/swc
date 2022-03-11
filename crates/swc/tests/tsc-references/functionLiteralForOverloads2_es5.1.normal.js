import * as swcHelpers from "@swc/helpers";
// basic uses of function literals with constructor overloads
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var f = C;
var f2 = C;
var f3 = D;
