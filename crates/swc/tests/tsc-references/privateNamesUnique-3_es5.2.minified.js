import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), A = function() {
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: 1
    });
}, _foo = {
    writable: !0,
    value: !0
}, B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.test = function(x) {
        swcHelpers.classStaticPrivateFieldSpecGet(x, B, _foo1);
    }, B;
}(), _foo1 = {
    writable: !0,
    value: !0
};
