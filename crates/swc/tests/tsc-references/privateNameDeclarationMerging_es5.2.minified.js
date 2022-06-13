import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var D = function() {
    "use strict";
    _class_call_check(this, D);
}, _x = new WeakMap(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return C.prototype.foo = function() {
        var c = new C();
        _class_private_field_get(c, _x);
        var d = new C();
        _class_private_field_get(d, _x);
    }, C;
}();
