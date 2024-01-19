//// [classExpression4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function() {
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    return _proto.foo = function() {
        return new C();
    }, C1;
}();
(new C).foo();
