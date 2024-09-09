//// [genericCallTypeArgumentInference.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var i, c = new (/*#__PURE__*/ function() {
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
}())('', 1);
c.foo('', 1), c.foo2('', 1), c.foo3(!0, 1), c.foo4('', !0), c.foo5(!0, 1), c.foo6(), c.foo7(''), c.foo8(), i.foo('', 1), i.foo2('', 1), i.foo3(!0, 1), i.foo4('', !0), i.foo5(!0, 1), i.foo6(), i.foo7(''), i.foo8();
