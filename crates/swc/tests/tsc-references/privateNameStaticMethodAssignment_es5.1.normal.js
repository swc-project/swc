import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_field_update from "@swc/helpers/src/_class_static_private_field_update.mjs";
import _class_static_private_field_destructure from "@swc/helpers/src/_class_static_private_field_destructure.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @target: es2015
var A3 = function A3(a, b) {
    "use strict";
    _class_call_check(this, A3);
    _class_static_private_field_spec_set(A3, A3, _method, function() {} // Error, not writable 
    );
    _class_static_private_field_spec_set(a, A3, _method, function() {}); // Error, not writable 
    _class_static_private_field_spec_set(b, A3, _method, function() {} //Error, not writable 
    );
    var ref;
    ref = {
        x: function() {}
    }, _class_static_private_field_destructure(A3, A3, _method).value = ref.x, ref; //Error, not writable 
    var x = _class_static_private_method_get(A3, A3, method);
    _class_static_private_field_update(b, A3, _method).value++ //Error, not writable 
    ;
};
function method() {}
