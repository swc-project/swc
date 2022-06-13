import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
// @useDefineForClassFields: false
// @target: es2015
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var _x = {
    writable: true,
    value: 1
};
var __ = {
    writable: true,
    value: function() {
        _class_static_private_field_spec_get(C, C, _x);
    }()
};
