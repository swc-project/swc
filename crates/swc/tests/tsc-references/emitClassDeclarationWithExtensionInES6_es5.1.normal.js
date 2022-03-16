import * as swcHelpers from "@swc/helpers";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    _proto.baz = function baz(a) {
        var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10;
    };
    return B;
}();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    _proto.baz = function baz(a, y) {
        swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "baz", this).call(this, a, y);
    };
    return C;
}(B);
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.call(this);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {
        swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this).call(this);
    };
    _proto.baz = function baz() {
        swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "baz", this).call(this, "hello", 10);
    };
    return D;
}(C);
