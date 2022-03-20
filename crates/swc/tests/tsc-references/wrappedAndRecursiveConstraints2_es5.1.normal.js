import * as swcHelpers from "@swc/helpers";
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var c = new C(1);
var c = new C(new C("")); // error
