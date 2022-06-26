import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
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
