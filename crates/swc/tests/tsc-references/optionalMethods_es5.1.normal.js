import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, Bar);
        this.d = d;
        this.e = e;
        this.c = 2;
    }
    swcHelpers.createClass(Bar, [
        {
            key: "f",
            value: function f() {
                return 1;
            }
        },
        {
            key: "h",
            value: function h() {
                return 2;
            }
        }
    ]);
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
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.a = 1;
        return _this;
    }
    swcHelpers.createClass(Derived, [
        {
            key: "f",
            value: function f() {
                return 1;
            }
        }
    ]);
    return Derived;
}(Base);
