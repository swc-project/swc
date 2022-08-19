import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c = new (function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto[Symbol.iterator] = function(x) {}, C;
}());
c[Symbol.iterator](""), c[Symbol.iterator](0);
