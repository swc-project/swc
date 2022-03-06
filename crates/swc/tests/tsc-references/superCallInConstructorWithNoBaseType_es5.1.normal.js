import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    super(); // error
};
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    super(); // error
    this.x = x;
};
