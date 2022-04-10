import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _bar, {
            writable: !0,
            value: 6
        }), this.qux = 6;
    }
    return A.prototype.quux = function() {}, A;
}();
