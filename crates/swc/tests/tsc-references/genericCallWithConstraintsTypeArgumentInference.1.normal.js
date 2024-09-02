//// [genericCallWithConstraintsTypeArgumentInference.ts]
// Basic type inference with generic calls and constraints, no errors expected
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    return Derived2;
}(Derived);
var b;
var d1;
var d2;
function foo(t) {
    return t;
}
var r = foo(b); // Base
var r2 = foo(d1); // Derived
function foo2(t, u) {
    return u;
}
function foo2b(u) {
    var x;
    return x;
}
function foo2c() {
    var x;
    return x;
}
var r3 = foo2b(d1); // Base
var r3b = foo2c(); // Base
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(t, u) {
        _class_call_check(this, C);
        this.t = t;
        this.u = u;
    }
    var _proto = C.prototype;
    _proto.foo = function foo(t, u) {
        return t;
    };
    _proto.foo2 = function foo2(t, u) {
        return u;
    };
    _proto.foo3 = function foo3(t, u) {
        return t;
    };
    _proto.foo4 = function foo4(t, u) {
        return t;
    };
    _proto.foo5 = function foo5(t, u) {
        return t;
    };
    _proto.foo6 = function foo6() {
        var x;
        return x;
    };
    _proto.foo7 = function foo7(u) {
        var x;
        return x;
    };
    _proto.foo8 = function foo8() {
        var x;
        return x;
    };
    return C;
}();
var c = new C(b, d1);
var r4 = c.foo(d1, d2); // Base
var r5 = c.foo2(b, d2); // Derived
var r6 = c.foo3(d1, d1); // Derived
var r7 = c.foo4(d1, d2); // Base
var r8 = c.foo5(d1, d2); // Derived
var r8b = c.foo5(d2, d2); // Derived2
var r9 = c.foo6(); // Derived
var r10 = c.foo7(d1); // Base
var r11 = c.foo8(); // Base
var i;
var r4 = i.foo(d1, d2); // Base
var r5 = i.foo2(b, d2); // Derived
var r6 = i.foo3(d1, d1); // Derived
var r7 = i.foo4(d1, d2); // Base
var r8 = i.foo5(d1, d2); // Derived
var r8b = i.foo5(d2, d2); // Derived2
var r9 = i.foo6(); // Derived
var r10 = i.foo7(d1); // Base
var r11 = i.foo8(); // Base
