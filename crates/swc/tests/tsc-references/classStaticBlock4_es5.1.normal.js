import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.s1 = 1;
var __ = {
    writable: true,
    value: function() {
        C.s1;
        C.s1;
        C.s2;
        C.s2;
    }()
};
C.s2 = 2;
C.ss2 = C.s1;
