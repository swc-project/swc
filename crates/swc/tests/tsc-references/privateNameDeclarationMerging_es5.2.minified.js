import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
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
