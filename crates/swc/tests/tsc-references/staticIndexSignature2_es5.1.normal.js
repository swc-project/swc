import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C["foo"] = 1;
C.bar = 2;
var foo = C["foo"];
C[42] = 42;
C[2] = 2;
var bar = C[42];
