import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var _class, _Foo, B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.m = function() {
        console.log(_class_static_private_field_spec_get(B, B, _foo).test), _class_static_private_field_spec_get(B, B, _foo).test = 10, new (_class_static_private_field_spec_get(B, B, _foo))().field;
    }, B;
}(), _foo = {
    writable: !0,
    value: ((_class = function _class1() {
        "use strict";
        _class_call_check(this, _class1), this.field = 10, console.log("hello"), new (_class_static_private_field_spec_get(B, B, _foo2))();
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    }).otherClass = 123, _Foo)
};
