import * as swcHelpers from "@swc/helpers";
var B = // @noImplicitOverride: true
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: a.js
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    _proto.foo = function foo(v) {};
    _proto.fooo = function fooo(v) {};
    return B;
}();
var D = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo(v) {};
    /** @override */ _proto.fooo = function fooo(v) {};
    /** @override */ _proto.bar = function bar(v) {};
    return D;
}(B);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    /** @override */ _proto.fooo = function fooo(v) {};
    /** @override */ _proto.bar = function bar(v) {};
    return C;
}();
