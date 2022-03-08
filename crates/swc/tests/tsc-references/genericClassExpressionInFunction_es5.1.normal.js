import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
function B1() {
    // class expression can use T
    return /*#__PURE__*/ function(A) {
        "use strict";
        swcHelpers.inherits(_class, A);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(A);
}
var B2 = function B2() {
    "use strict";
    swcHelpers.classCallCheck(this, B2);
    this.anon = /*#__PURE__*/ function(A) {
        swcHelpers.inherits(_class, A);
        var _super = swcHelpers.createSuper(_class);
        function _class() {
            swcHelpers.classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(A);
};
function B3() {
    return /*#__PURE__*/ function(A) {
        "use strict";
        swcHelpers.inherits(Inner, A);
        var _super = swcHelpers.createSuper(Inner);
        function Inner() {
            swcHelpers.classCallCheck(this, Inner);
            return _super.apply(this, arguments);
        }
        return Inner;
    }(A);
}
var K = // extends can call B
/*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(K, _superClass);
    var _super = swcHelpers.createSuper(K);
    function K() {
        swcHelpers.classCallCheck(this, K);
        return _super.apply(this, arguments);
    }
    return K;
}(B1());
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C, _superClass);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(new B2().anon);
var b3Number = B3();
var S = /*#__PURE__*/ function(b3Number1) {
    "use strict";
    swcHelpers.inherits(S, b3Number1);
    var _super = swcHelpers.createSuper(S);
    function S() {
        swcHelpers.classCallCheck(this, S);
        return _super.apply(this, arguments);
    }
    return S;
}(b3Number);
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
