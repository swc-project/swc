import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var _foo = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: 1
    });
}, _foo = {
    writable: !0,
    value: !0
}, B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.test = function(x) {
        _class_static_private_field_spec_get(x, B, _foo1);
    }, B;
}(), _foo1 = {
    writable: !0,
    value: !0
};
