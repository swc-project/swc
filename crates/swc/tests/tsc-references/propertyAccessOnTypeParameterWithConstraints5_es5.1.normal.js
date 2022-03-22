import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        return "";
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.bar = function bar() {
        return "";
    };
    return B;
}(A);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a1 = x["foo"](); // should be string
        return a1 + x.foo() + x.notHere();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.notHere();
var r2b = i.foo["foo"]();
var a;
// BUG 794164
var r3 = a().notHere();
var r3b = a()["foo"]();
var b = {
    foo: function(x) {
        var a2 = x["foo"](); // should be string
        return a2 + x.notHere();
    },
    // BUG 794164
    bar: b.foo(1).notHere()
};
var r4 = b.foo(new B()); // error after constraints above made illegal, doesn't matter
