import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export function foo() {}
export var Aleph = function() {
    "use strict";
    function Aleph(a, b) {
        _class_call_check(this, Aleph), this.field = b;
    }
    var _proto = Aleph.prototype;
    return _proto.doIt = function() {}, Aleph;
}();
export var c = 12;
