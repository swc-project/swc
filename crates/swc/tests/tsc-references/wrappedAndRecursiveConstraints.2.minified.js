//// [wrappedAndRecursiveConstraints.ts]
// no errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function C(data) {
        _class_call_check(this, C), this.data = data;
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}())(null).foo(null);
