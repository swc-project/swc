//// [genericCallWithConstraintsTypeArgumentInference.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var b, d1, d2, i, c = new (/*#__PURE__*/ function() {
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
}())(b, d1);
c.foo(d1, d2), c.foo2(b, d2), c.foo3(d1, d1), c.foo4(d1, d2), c.foo5(d1, d2), c.foo5(d2, d2), c.foo6(), c.foo7(d1), c.foo8(), i.foo(d1, d2), i.foo2(b, d2), i.foo3(d1, d1), i.foo4(d1, d2), i.foo5(d1, d2), i.foo5(d2, d2), i.foo6(), i.foo7(d1), i.foo8();
