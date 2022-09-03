//// [genericCallWithConstraintsTypeArgumentInference.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var b, d1, d2, i, Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
function foo(t) {
    return t;
}
var r = foo(b), r2 = foo(d1);
function foo2(t, u) {
    return u;
}
function foo2b(u) {}
function foo2c() {}
var r3 = foo2b(d1), r3b = foo2c(), C = function() {
    "use strict";
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
}(), c = new C(b, d1), r4 = c.foo(d1, d2), r5 = c.foo2(b, d2), r6 = c.foo3(d1, d1), r7 = c.foo4(d1, d2), r8 = c.foo5(d1, d2), r8b = c.foo5(d2, d2), r9 = c.foo6(), r10 = c.foo7(d1), r11 = c.foo8(), r4 = i.foo(d1, d2), r5 = i.foo2(b, d2), r6 = i.foo3(d1, d1), r7 = i.foo4(d1, d2), r8 = i.foo5(d1, d2), r8b = i.foo5(d2, d2), r9 = i.foo6(), r10 = i.foo7(d1), r11 = i.foo8();
