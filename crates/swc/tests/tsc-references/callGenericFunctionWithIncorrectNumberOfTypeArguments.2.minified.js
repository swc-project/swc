//// [callGenericFunctionWithIncorrectNumberOfTypeArguments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var f2 = function(x, y) {
    return null;
};
f2(1, ''), f2(1, ''), (void 0)(1, ''), (void 0)(1, '');
var C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x, y) {
        return null;
    }, C;
}();
new C().f(1, ''), new C().f(1, ''), (void 0).f(1, ''), (void 0).f(1, '');
var C2 = /*#__PURE__*/ function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x, y) {
        return null;
    }, C2;
}();
new C2().f(1, ''), new C2().f(1, ''), (void 0).f(1, ''), (void 0).f(1, '');
