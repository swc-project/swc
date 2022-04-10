import * as swcHelpers from "@swc/helpers";
var _y = new WeakMap(), Test = function() {
    function Test() {
        swcHelpers.classCallCheck(this, Test), swcHelpers.classPrivateFieldInit(this, _y, {
            writable: !0,
            value: 123
        });
    }
    return Test.something = function(obj) {
        var _s, _x, _x1;
        swcHelpers.classPrivateFieldSet(obj[(new (_x = new WeakMap(), function _class() {
            swcHelpers.classCallCheck(this, _class), swcHelpers.classPrivateFieldInit(this, _x, {
                writable: !0,
                value: 1
            }), this.s = "prop";
        })).s], _y, 1), swcHelpers.classPrivateFieldSet(_s = obj[(new (_x1 = new WeakMap(), function _class() {
            swcHelpers.classCallCheck(this, _class), swcHelpers.classPrivateFieldInit(this, _x1, {
                writable: !0,
                value: 1
            }), this.s = "prop";
        })).s], _y, swcHelpers.classPrivateFieldGet(_s, _y) + 1);
    }, Test;
}();
