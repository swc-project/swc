//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var C = function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.b = function() {
        return this;
    }, C.a = function() {
        return this;
    }, C;
}();
C.a(), new C().b();
