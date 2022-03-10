import * as swcHelpers from "@swc/helpers";
// @target: es2015
var friendA;
var _x = /*#__PURE__*/ new WeakMap();
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(v) {
        swcHelpers.classCallCheck(this, A);
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _x, v);
    }
    var _proto = A.prototype;
    _proto.getX = function getX() {
        return swcHelpers.classPrivateFieldGet(this, _x);
    };
    return A;
}();
var __ = {
    writable: true,
    value: function() {
        friendA = {
            getX: function getX(obj) {
                return swcHelpers.classPrivateFieldGet(obj, _x);
            },
            setX: function setX(obj, value) {
                swcHelpers.classPrivateFieldSet(obj, _x, value);
            }
        };
    }()
};
var B = function B(a1) {
    "use strict";
    swcHelpers.classCallCheck(this, B);
    var x = friendA.getX(a1); // ok
    friendA.setX(a1, x + 1); // ok
};
var a = new A(41);
var b = new B(a);
a.getX();
