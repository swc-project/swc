import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(x, z) {
    "use strict";
    _class_call_check(this, C);
    this.x = x;
    this.z = z;
};
var c;
var r = c.y;
var r2 = c.x; // error
var r3 = c.z; // error
var D = function D(a, x, z) {
    "use strict";
    _class_call_check(this, D);
    this.x = x;
    this.z = z;
};
var d;
var r = d.y;
var r2 = d.x; // error
var r3 = d.a; // error
var r4 = d.z; // error
