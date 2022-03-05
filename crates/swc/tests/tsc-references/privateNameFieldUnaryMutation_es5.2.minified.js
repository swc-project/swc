import * as swcHelpers from "@swc/helpers";
var _test = new WeakMap(), C = function() {
    "use strict";
    function C() {
        var _this_test;
        for(swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _test, {
            writable: !0,
            value: 24
        }), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1), swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) - 1), swcHelpers.classPrivateFieldSet(this, _test, 0); 10 > swcHelpers.classPrivateFieldGet(this, _test); swcHelpers.classPrivateFieldSet(this, _test, +swcHelpers.classPrivateFieldGet(this, _test) + 1));
        for(swcHelpers.classPrivateFieldSet(this, _test, 0); 10 > swcHelpers.classPrivateFieldGet(this, _test); swcHelpers.classPrivateFieldSet(this, _test, (_this_test = +swcHelpers.classPrivateFieldGet(this, _test)) + 1), _this_test);
    }
    return swcHelpers.createClass(C, [
        {
            key: "test",
            value: function() {
                var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _this_test;
                for(swcHelpers.classPrivateFieldSet(_ref = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref, _test) + 1), swcHelpers.classPrivateFieldSet(_ref1 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref1, _test) - 1), swcHelpers.classPrivateFieldSet(_ref2 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref2, _test) + 1), swcHelpers.classPrivateFieldSet(_ref3 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref3, _test) - 1), swcHelpers.classPrivateFieldSet(_ref4 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref4, _test) + 1), swcHelpers.classPrivateFieldSet(_ref5 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref5, _test) - 1), swcHelpers.classPrivateFieldSet(_ref6 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref6, _test) + 1), swcHelpers.classPrivateFieldSet(_ref7 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref7, _test) - 1), swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); 10 > swcHelpers.classPrivateFieldGet(this.getInstance(), _test); swcHelpers.classPrivateFieldSet(_ref8 = this.getInstance(), _test, +swcHelpers.classPrivateFieldGet(_ref8, _test) + 1));
                for(swcHelpers.classPrivateFieldSet(this.getInstance(), _test, 0); 10 > swcHelpers.classPrivateFieldGet(this.getInstance(), _test); swcHelpers.classPrivateFieldSet(_ref9 = this.getInstance(), _test, (_this_test = +swcHelpers.classPrivateFieldGet(_ref9, _test)) + 1), _this_test);
            }
        },
        {
            key: "getInstance",
            value: function() {
                return new C();
            }
        }
    ]), C;
}();
