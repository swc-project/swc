//// [a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function Outer() {
    this.y = 2;
}
Outer.Inner = function I() {
    "use strict";
    _class_call_check(this, I);
    this.x = 1;
};
/** @type {Outer} */ var ok;
ok.y;
/** @type {Outer.Inner} */ var oc;
oc.x;
