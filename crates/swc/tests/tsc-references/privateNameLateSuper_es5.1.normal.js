import * as swcHelpers from "@swc/helpers";
// @target: es2015
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var _x = /*#__PURE__*/ new WeakMap();
var A = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(A, B);
    var _super = swcHelpers.createSuper(A);
    function A() {
        swcHelpers.classCallCheck(this, A);
        var _this;
        void 0;
        _this = _super.call(this);
        swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _x, {
            writable: true,
            value: void 0
        });
        return _this;
    }
    return A;
}(B);
