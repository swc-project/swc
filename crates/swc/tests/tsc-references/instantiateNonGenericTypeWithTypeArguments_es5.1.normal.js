import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var c = new C();
function Foo() {}
var r = new Foo();
var f;
var r2 = new f();
var a;
// BUG 790977
var r2 = new a();
