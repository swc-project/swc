import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _foo = new WeakMap(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), _class_private_field_init(this, _foo, {
            get: void 0,
            set: set_foo
        });
    }
    return C.prototype.bar = function() {
        var x = _class_private_field_set(this, _foo, 84);
        console.log(x);
    }, C;
}();
function set_foo(a) {}
new C().bar();
