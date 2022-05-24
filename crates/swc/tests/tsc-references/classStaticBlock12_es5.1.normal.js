import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
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
