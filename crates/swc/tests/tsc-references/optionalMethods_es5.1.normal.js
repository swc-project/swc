import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function test1(x) {
    x.a;
    x.b;
    x.f;
    x.g;
    var f1 = x.f();
    var g1 = x.g && x.g();
    var g2 = x.g ? x.g() : 0;
}
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar(d) {
        var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10;
        _class_call_check(this, Bar);
        this.d = d;
        this.e = e;
        this.c = 2;
    }
    var _proto = Bar.prototype;
    _proto.f = function f() {
        return 1;
    };
    _proto.h = function h() {
        return 2;
    };
    return Bar;
}();
function test2(x) {
    x.a;
    x.b;
    x.c;
    x.d;
    x.e;
    x.f;
    x.g;
    var f1 = x.f();
    var g1 = x.g && x.g();
    var g2 = x.g ? x.g() : 0;
    var h1 = x.h && x.h();
    var h2 = x.h ? x.h() : 0;
}
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.a = 1;
        return _this;
    }
    var _proto = Derived.prototype;
    _proto.f = function f() {
        return 1;
    };
    return Derived;
}(Base);
