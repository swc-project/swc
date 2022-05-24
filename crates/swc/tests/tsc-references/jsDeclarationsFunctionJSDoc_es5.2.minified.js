import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export function foo() {}
export var Aleph = function() {
    "use strict";
    function Aleph(a, b) {
        _class_call_check(this, Aleph), this.field = b;
    }
    return Aleph.prototype.doIt = function() {}, Aleph;
}();
export var c = 12;
