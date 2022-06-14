import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var friendA, _x = new WeakMap(), A = function() {
    "use strict";
    function A(v) {
        _class_call_check(this, A), _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _x, v);
    }
    return A.prototype.getX = function() {
        return _class_private_field_get(this, _x);
    }, A;
}();
friendA = {
    getX: function(obj) {
        return _class_private_field_get(obj, _x);
    },
    setX: function(obj, value) {
        _class_private_field_set(obj, _x, value);
    }
};
var B = function(a1) {
    "use strict";
    _class_call_check(this, B);
    var x = friendA.getX(a1);
    friendA.setX(a1, x + 1);
}, a = new A(41);
new B(a), a.getX();
