import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        return 1;
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
        swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "foo", this).call(this);
    };
    _proto.baz = function baz() {
        return this.foo;
    };
    return B;
}(A);
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return 2;
    };
    _proto.qux // 2 errors, foo is abstract
     = function qux() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this).call(this) || swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this);
    };
    _proto.norf = function norf() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", this).call(this);
    };
    return C;
}(B);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    var _proto = AA.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    _proto.bar = function bar() {
        return this.foo();
    };
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        swcHelpers.classCallCheck(this, BB);
        return _super.apply(this, arguments);
    }
    return BB;
}(AA);
