//// [functionImplementationErrors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var m, f1 = function() {
    return "";
}, f2 = function() {
    return "";
}, f3 = function() {
    return "";
}, f4 = function() {
    return [
        ""
    ];
};
function f5() {}
function f6() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
function f7() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && arguments[1];
}
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, AnotherClass = function AnotherClass() {
    "use strict";
    _class_call_check(this, AnotherClass);
}, Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
function f8() {
    return new Derived1();
}
var f9 = function() {
    return new Derived1();
}, f10 = function() {
    return new Derived1();
};
function f11() {
    return new Base();
}
var f12 = function() {
    return new Base();
}, f13 = function() {
    return new Base();
};
