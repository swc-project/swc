import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A), console.log(_class_static_private_field_spec_get(A, A, _myField)), console.log(_class_static_private_field_spec_get(this, A, _myField));
}, _myField = {
    writable: !0,
    value: "hello world"
};
