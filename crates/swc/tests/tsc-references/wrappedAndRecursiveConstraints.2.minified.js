//// [wrappedAndRecursiveConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function C(data) {
        _class_call_check(this, C), this.data = data;
    }
    var _proto = C.prototype;
    return _proto.foo = function(x) {
        return x;
    }, C;
}())(null).foo(null);
