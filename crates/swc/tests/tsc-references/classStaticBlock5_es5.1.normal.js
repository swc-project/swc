import * as swcHelpers from "@swc/helpers";
var _superprop_get_b = ()=>super.b, _superprop_get_a = ()=>super.a;
// @target: esnext, es2022, es2015, es5
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
B.a = 1;
B.b = 2;
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C.b = 3;
C.c = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
var __ = {
    writable: true,
    value: function() {
        C.b;
        _superprop_get_b();
        _superprop_get_a();
    }()
};
