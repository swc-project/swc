//// [callNonGenericFunctionWithTypeArguments.ts]
var f3, i, i2, a, a2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
f3(1), new (function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x) {
        return null;
    }, C;
}())().f(1), i.f(1), new (function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x) {
        return null;
    }, C2;
}())().f(1), i2.f(1), a(), a2();
