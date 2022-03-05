import * as swcHelpers from "@swc/helpers";
var C = function C(y) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var c;
var r = c.y;
var D = function D(y) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.y = y;
};
var d;
var r2 = d.y;
var E = function E(y) {
    "use strict";
    swcHelpers.classCallCheck(this, E);
    this.y = y;
};
var e;
var r3 = e.y; // error
var F = function F(y) {
    "use strict";
    swcHelpers.classCallCheck(this, F);
    this.y = y;
};
var f;
var r4 = f.y; // error
