import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.foo = function(v) {
        return v;
    }, _class;
}();
C.a, C.a = 1, C[2], C[2] = 42, new C().foo(1);
