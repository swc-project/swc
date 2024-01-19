//// [indexersInClassType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var r = new (function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.fn = function() {
        return this;
    }, C;
}())().fn();
r[1], r.a;
