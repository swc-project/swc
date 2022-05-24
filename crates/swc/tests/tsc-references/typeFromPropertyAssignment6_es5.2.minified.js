import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Outer = function() {
    "use strict";
    _class_call_check(this, Outer);
};
Outer.Inner = function() {
    "use strict";
    function I() {
        _class_call_check(this, I);
    }
    return I.prototype.messages = function() {
        return [];
    }, I;
}(), Outer.i, Outer.i.messages();
