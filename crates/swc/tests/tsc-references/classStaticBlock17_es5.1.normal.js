import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
// @target: es2015
var friendA;
var _x = /*#__PURE__*/ new WeakMap();
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(v) {
        _class_call_check(this, A);
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _x, v);
    }
    var _proto = A.prototype;
    _proto.getX = function getX() {
        return _class_private_field_get(this, _x);
    };
    return A;
}();
var __ = {
    writable: true,
    value: function() {
        friendA = {
            getX: function getX(obj) {
                return _class_private_field_get(obj, _x);
            },
            setX: function setX(obj, value) {
                _class_private_field_set(obj, _x, value);
            }
        };
    }()
};
var B = function B(a) {
    "use strict";
    _class_call_check(this, B);
    var x = friendA.getX(a); // ok
    friendA.setX(a, x + 1); // ok
};
var a = new A(41);
var b = new B(a);
a.getX();
