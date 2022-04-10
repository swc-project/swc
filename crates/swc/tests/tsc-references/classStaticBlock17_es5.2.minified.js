import * as swcHelpers from "@swc/helpers";
var friendA, _x = new WeakMap(), A = function() {
    function A(v) {
        swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _x, v);
    }
    return A.prototype.getX = function() {
        return swcHelpers.classPrivateFieldGet(this, _x);
    }, A;
}();
friendA = {
    getX: function(obj) {
        return swcHelpers.classPrivateFieldGet(obj, _x);
    },
    setX: function(obj, value) {
        swcHelpers.classPrivateFieldSet(obj, _x, value);
    }
};
var B = function(a1) {
    swcHelpers.classCallCheck(this, B);
    var x = friendA.getX(a1);
    friendA.setX(a1, x + 1);
}, a = new A(41);
new B(a), a.getX();
