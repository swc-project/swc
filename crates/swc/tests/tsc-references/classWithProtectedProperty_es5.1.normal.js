import * as swcHelpers from "@swc/helpers";
// accessing any protected outside the class is an error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.a = "";
        this.b = "";
        this.d = function() {
            return "";
        };
    }
    var _proto = C.prototype;
    _proto.c = function c() {
        return "";
    };
    C.f = function f() {
        return "";
    };
    return C;
}();
C.g = function() {
    return "";
};
var D = /*#__PURE__*/ function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    _proto.method = function method() {
        // No errors
        var d = new D();
        var r1 = d.x;
        var r2 = d.a;
        var r3 = d.b;
        var r4 = d.c();
        var r5 = d.d();
        var r6 = C.e;
        var r7 = C.f();
        var r8 = C.g();
    };
    return D;
}(C);
