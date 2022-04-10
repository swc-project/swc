import * as swcHelpers from "@swc/helpers";
var D = function() {
    swcHelpers.classCallCheck(this, D);
}, _x = new WeakMap(), C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return C.prototype.foo = function() {
        var c = new C();
        swcHelpers.classPrivateFieldGet(c, _x);
        var d = new C();
        swcHelpers.classPrivateFieldGet(d, _x);
    }, C;
}();
