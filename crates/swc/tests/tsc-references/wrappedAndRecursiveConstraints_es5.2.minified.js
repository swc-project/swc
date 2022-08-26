import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function C(data) {
        _class_call_check(this, C), this.data = data;
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}())(null).foo(null);
