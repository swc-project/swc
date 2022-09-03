//// [narrowingConstrainedTypeVariable.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f1(v) {
    _instanceof(v, C);
}
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function f2(v) {
    _instanceof(v, C);
}
var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
function f3(v) {
    _instanceof(v, E);
}
