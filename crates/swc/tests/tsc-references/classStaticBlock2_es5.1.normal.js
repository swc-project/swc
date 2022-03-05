import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015, es5
var a = 1;
var b = 2;
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var __ = {
    writable: true,
    value: function() {
        var a1 = 11;
        a1;
        b;
    }()
};
var __1 = {
    writable: true,
    value: function() {
        var a2 = 11;
        a2;
        b;
    }()
};
