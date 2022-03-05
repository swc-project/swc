import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022
var a = 1;
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.f1 = 1;
var __ = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f2 = 2;
var __1 = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f3 = 3;
