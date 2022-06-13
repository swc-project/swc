import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
// @target: esnext, es2022, es2015
var getX;
var _x = /*#__PURE__*/ new WeakMap();
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
    _class_private_field_init(this, _x, {
        writable: true,
        value: 1
    });
    _class_private_field_set(this, _x, x);
};
var __ = {
    writable: true,
    value: function() {
        // getX has privileged access to #x
        getX = function(obj) {
            return _class_private_field_get(obj, _x);
        };
    }()
};
