import * as swcHelpers from "@swc/helpers";
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
var a = x();
var b = x("hello");
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var c = x(x);
var d = x(x);
