import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
// @target: esnext, es2022, es2015
var getX;
var _x = /*#__PURE__*/ new WeakMap();
var tmp = (getX = function(a) {
    return _class_private_field_get(a, _x);
}, "_");
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _class_private_field_init(this, _x, {
            writable: true,
            value: 100
        });
    }
    var _proto = A.prototype;
    _proto[tmp] = function() {};
    return A;
}();
console.log(getX(new A));
