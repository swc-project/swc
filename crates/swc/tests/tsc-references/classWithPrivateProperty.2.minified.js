//// [classWithPrivateProperty.ts]
// accessing any private outside the class is an error
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function() {
    function C() {
        _class_call_check(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    return C.prototype.c = function() {
        return "";
    }, C.f = function() {
        return "";
    }, C;
}();
C.g = function() {
    return "";
};
var c = new C();
c.x, c.a, c.b, c.c(), c.d(), C.e, C.f(), C.g();
