import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _class, _Foo, _foo = new WeakMap(), _foo2 = new WeakMap(), B = function() {
    "use strict";
    _class_call_check(this, B), _class_private_field_init(this, _foo, {
        writable: !0,
        value: ((_class = function _class() {
            _class_call_check(this, _class), console.log("hello");
        }).test = 123, _class)
    }), _class_private_field_init(this, _foo2, {
        writable: !0,
        value: ((_Foo = function Foo() {
            _class_call_check(this, Foo);
        }).otherClass = 123, _Foo)
    });
};
