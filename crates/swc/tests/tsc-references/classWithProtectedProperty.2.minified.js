//// [classWithProtectedProperty.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function() {
    function C() {
        _class_call_check(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    var _proto = C.prototype;
    return _proto.c = function() {
        return "";
    }, C.f = function() {
        return "";
    }, C;
}();
C.g = function() {
    return "";
};
