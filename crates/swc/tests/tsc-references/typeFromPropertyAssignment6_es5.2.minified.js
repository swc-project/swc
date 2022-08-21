import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
Outer.Inner = function() {
    "use strict";
    function I() {
        _class_call_check(this, I);
    }
    return I.prototype.messages = function() {
        return [];
    }, I;
}(), Outer.i;
Outer.i.messages();
