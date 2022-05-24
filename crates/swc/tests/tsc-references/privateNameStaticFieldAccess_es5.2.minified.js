import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var A = function() {
    "use strict";
    _class_call_check(this, A), console.log(_class_static_private_field_spec_get(A, A, _myField)), console.log(_class_static_private_field_spec_get(this, A, _myField));
}, _myField = {
    writable: !0,
    value: "hello world"
};
