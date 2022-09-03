//// [staticIndexSignature6.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    return function() {
        "use strict";
        function _class() {
            _class_call_check(this, _class);
        }
        return _class.prototype.foo = function(v) {
            return v;
        }, _class;
    }();
}
var C = foo();
C.a, C.a = 1, C[2], C[2] = 42;
var c = new C();
c.foo(1);
