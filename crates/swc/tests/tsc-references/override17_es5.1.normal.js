import * as swcHelpers from "@swc/helpers";
// @noImplicitOverride: true
// @useDefineForClassFields: true
// @target: es2015,esnext
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.m1 = function m1() {
        return 0;
    };
    _proto.m2 = function m2() {
        return 0;
    };
    _proto.m3 = function m3() {};
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
    _proto.m1 = function m1() {
        return 10;
    };
    _proto.m2 = function m2() {
        return 30;
    };
    _proto.m3 = function m3() {};
    return B;
}(A);
