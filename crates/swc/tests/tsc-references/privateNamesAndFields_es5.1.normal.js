import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: true,
        value: void 0
    });
    swcHelpers.classPrivateFieldSet(this, _foo, 3);
};
var _foo1 = /*#__PURE__*/ new WeakMap();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        var _this;
        _this = _super.call(this);
        swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _foo1, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(swcHelpers.assertThisInitialized(_this), _foo1, "some string");
        return _this;
    }
    return B;
}(A);
