import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: ES5
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b(a) {};
    Base.s = function s(a) {};
    _create_class(Base, [
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
// Increase visibility of all protected members to public
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(a) {
        _class_call_check(this, Derived);
        return _super.call(this, a);
    }
    var _proto = Derived.prototype;
    _proto.b = function b(a) {};
    Derived.s = function s(a) {};
    _create_class(Derived, [
        {
            key: "c",
            get: function get() {
                return y;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return y;
            },
            set: function set(a) {}
        }
    ]);
    return Derived;
}(Base);
var d = new Derived(y);
var r1 = d.a;
var r2 = d.b(y);
var r3 = d.c;
var r3a = d.d;
d.c = y;
var r4 = Derived.r;
var r5 = Derived.s(y);
var r6 = Derived.t;
var r6a = Derived.u;
Derived.t = y;
var Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
var d2;
var r7 = d2[""];
var r8 = d2[1];
