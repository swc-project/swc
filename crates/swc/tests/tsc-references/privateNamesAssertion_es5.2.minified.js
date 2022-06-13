import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _p1 = new WeakMap(), Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo), _class_private_field_init(this, _p1, {
            writable: !0,
            value: function(v) {
                if ("string" != typeof v) throw Error();
            }
        });
    }
    return Foo.prototype.m1 = function(v) {
        _class_private_field_get(this, _p1).call(this, v);
    }, Foo;
}(), _p11 = new WeakSet(), Foo2 = function() {
    "use strict";
    function Foo2() {
        _class_call_check(this, Foo2), _class_private_method_init(this, _p11);
    }
    return Foo2.prototype.m1 = function(v) {
        _class_private_method_get(this, _p11, p1).call(this, v);
    }, Foo2;
}();
function p1(v) {
    if ("string" != typeof v) throw Error();
}
