import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    _class_call_check(this, C), this.p = 1;
};
C.prototype = {
    q: 2
};
var c = new C();
c.p, c.q;
