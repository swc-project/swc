import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), A = function() {
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: void 0
    }), swcHelpers.classPrivateFieldSet(this, _foo, 3);
}, _foo1 = new WeakMap(), B = function(A1) {
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.call(this), swcHelpers.classPrivateFieldInit(swcHelpers.assertThisInitialized(_this), _foo1, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(swcHelpers.assertThisInitialized(_this), _foo1, "some string"), _this;
    }
    return B;
}(A);
