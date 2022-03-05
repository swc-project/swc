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
    swcHelpers.createClass(A, [
        {
            key: "doSomething",
            value: function doSomething() {}
        }
    ]);
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
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo() {} // Remove override
        }
    ]);
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
    swcHelpers.createClass(C, [
        {
            key: "doSomethang",
            value: function doSomethang() {} // Suggestion 'doSomething'
        }
    ]);
    return C;
}(CreateMixin(Context, A));
