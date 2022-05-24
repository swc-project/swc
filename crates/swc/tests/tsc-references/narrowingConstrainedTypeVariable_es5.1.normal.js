import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
// @strict: true
// Repro from #20138
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f1(v) {
    if (_instanceof(v, C)) {
        var x = v;
    } else {
        var s = v;
    }
}
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function f2(v) {
    if (_instanceof(v, C)) {
        var x = v;
    } else {
        var y = v;
    }
}
var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
function f3(v) {
    if (_instanceof(v, E)) {
        var x = v;
    } else {
        var y = v;
    }
}
