import * as swcHelpers from "@swc/helpers";
var Context = function Context() {
    "use strict";
    swcHelpers.classCallCheck(this, Context);
};
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.doSomething = function doSomething() {};
    return A;
}();
var B = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(B, _superClass);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.foo // Remove override
     = function foo() {};
    return B;
}(CreateMixin(Context, A));
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C, _superClass);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.doSomethang // Suggestion 'doSomething'
     = function doSomethang() {};
    return C;
}(CreateMixin(Context, A));
