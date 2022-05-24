import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: void 0
    });
}, _foo1 = new WeakMap(), B = function() {
    "use strict";
    _class_call_check(this, B), _class_private_field_init(this, _foo1, {
        writable: !0,
        value: void 0
    });
};
new B();
