import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), B = function B() {
    "use strict";
    _class_call_check(this, B), _class_private_field_init(this, _foo, {
        writable: !0,
        value: void 0
    });
};
new B();
