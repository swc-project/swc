import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var getX, _x = new WeakMap(), tmp = (getX = function(a) {
    return _class_private_field_get(a, _x);
}, "_"), A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), _class_private_field_init(this, _x, {
            writable: !0,
            value: 100
        });
    }
    return A.prototype[tmp] = function() {}, A;
}();
console.log(getX(new A));
