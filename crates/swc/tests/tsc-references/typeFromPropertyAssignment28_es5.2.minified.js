import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    _class_call_check(this, C), this.p = 1;
};
C.prototype = {
    q: 2
};
var c = new C();
c.p, c.q;
