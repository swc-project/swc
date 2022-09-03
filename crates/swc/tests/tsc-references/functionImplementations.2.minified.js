//// [functionImplementations.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var n, b, v = void 0, a = function f() {
    return f;
}, a = function f() {
    return f();
}, a = function f() {
    return f;
};
function rec1() {
    return rec2();
}
function rec2() {
    return rec1();
}
var a = rec1(), a = rec2();
function rec3() {
    return rec4();
}
function rec4() {
    return rec3();
}
var n = rec3(), n = rec4(), n = 3, nu = null, nu = null, un = void 0, un = void 0, n = 4, n = 4, n = 3, Base = function Base() {
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
}(Base), b = new Base(), a = new Base();
function thisFunc() {}
function opt1() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
function opt2() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
function opt3(n) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function f6() {}
var Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), AnotherClass = function AnotherClass() {
    "use strict";
    _class_call_check(this, AnotherClass);
}, f7 = function(x) {
    return x < 0 ? x : x.toString();
}, f8 = function(x) {
    return new Base();
}, f9 = function(x) {
    return new Base();
}, f10 = function(x) {
    return new Derived();
}, f11 = function(x) {
    return new Base();
}, f12 = function(x) {
    return new Base();
};
