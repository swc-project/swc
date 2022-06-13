import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(y) {
    "use strict";
    _class_call_check(this, C);
};
var c;
var r = c.y;
var D = function D(y) {
    "use strict";
    _class_call_check(this, D);
    this.y = y;
};
var d;
var r2 = d.y;
var E = function E(y) {
    "use strict";
    _class_call_check(this, E);
    this.y = y;
};
var e;
var r3 = e.y; // error
var F = function F(y) {
    "use strict";
    _class_call_check(this, F);
    this.y = y;
};
var f;
var r4 = f.y; // error
