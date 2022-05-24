import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
function f1() {
    var x1 = new Mixed1("hello");
    var x2 = new Mixed1(42);
    var x3 = new Mixed2("hello");
    var x4 = new Mixed2(42);
    var x5 = new Mixed3("hello");
    var x6 = new Mixed3(42);
    var x7 = new Mixed4("hello");
    var x8 = new Mixed4(42);
    var x9 = new Mixed5();
}
function f2() {
    var x = new Mixed1("hello");
    x.a;
    x.p;
    Mixed1.p;
}
function f3() {
    var x = new Mixed2("hello");
    x.a;
    x.p;
    Mixed2.p;
}
function f4() {
    var x = new Mixed3("hello");
    x.a;
    x.p;
    x.f();
    Mixed3.p;
    Mixed3.f();
}
function f5() {
    var x = new Mixed4("hello");
    x.a;
    x.p;
    x.f();
    Mixed4.p;
    Mixed4.f();
}
function f6() {
    var x = new Mixed5();
    x.p;
    x.f();
    Mixed5.p;
    Mixed5.f();
}
var C2 = /*#__PURE__*/ function(Mixed1) {
    "use strict";
    _inherits(C2, Mixed1);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        var _this;
        _this = _super.call(this, "hello");
        _this.a;
        _this.b;
        _this.p;
        return _this;
    }
    return C2;
}(Mixed1);
var C3 = /*#__PURE__*/ function(Mixed3) {
    "use strict";
    _inherits(C3, Mixed3);
    var _super = _create_super(C3);
    function C3() {
        _class_call_check(this, C3);
        var _this;
        _this = _super.call(this, 42);
        _this.a;
        _this.b;
        _this.p;
        _this.f();
        return _this;
    }
    var _proto = C3.prototype;
    _proto.f = function f() {
        return _get(_get_prototype_of(C3.prototype), "f", this).call(this);
    };
    return C3;
}(Mixed3);
