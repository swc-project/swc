//// [genericCallWithConstraintsTypeArgumentInference.ts]
import "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_inherits";
var c = new (/*#__PURE__*/ function() {
    function C(t, u) {
        _class_call_check(this, C), this.t = t, this.u = u;
    }
    var _proto = C.prototype;
    return _proto.foo = function(t, u) {
        return t;
    }, _proto.foo2 = function(t, u) {
        return u;
    }, _proto.foo3 = function(t, u) {
        return t;
    }, _proto.foo4 = function(t, u) {
        return t;
    }, _proto.foo5 = function(t, u) {
        return t;
    }, _proto.foo6 = function() {}, _proto.foo7 = function(u) {}, _proto.foo8 = function() {}, C;
}())(void 0, void 0);
c.foo(void 0, void 0), c.foo2(void 0, void 0), c.foo3(void 0, void 0), c.foo4(void 0, void 0), c.foo5(void 0, void 0), c.foo5(void 0, void 0), c.foo6(), c.foo7(void 0), c.foo8(), (void 0).foo(void 0, void 0), (void 0).foo2(void 0, void 0), (void 0).foo3(void 0, void 0), (void 0).foo4(void 0, void 0), (void 0).foo5(void 0, void 0), (void 0).foo5(void 0, void 0), (void 0).foo6(), (void 0).foo7(void 0), (void 0).foo8();
