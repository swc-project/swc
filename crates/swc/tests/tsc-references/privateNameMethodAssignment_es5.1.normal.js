import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _method = /*#__PURE__*/ new WeakSet();
// @target: es2015
var A3 = function A3(a, b) {
    "use strict";
    _class_call_check(this, A3);
    _class_private_method_init(this, _method);
    _class_private_field_set(this, _method, function() {} // Error, not writable 
    );
    _class_private_field_set(a, _method, function() {}); // Error, not writable 
    _class_private_field_set(b, _method, function() {} //Error, not writable 
    );
    var ref;
    ref = {
        x: function() {}
    }, _class_private_field_destructure(this, _method).value = ref.x, ref; //Error, not writable 
    var x = _class_private_method_get(this, _method, method);
    _class_private_field_update(b, _method).value++ //Error, not writable 
    ;
};
function method() {}
