import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _brand_check_brand = new WeakSet(), _unused = new WeakMap(), _brand = new WeakMap(), Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo), _class_private_field_init(this, _unused, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _brand, {
            writable: !0,
            value: void _brand_check_brand.add(this)
        });
    }
    return Foo.prototype.isFoo = function(v) {
        return _brand_check_brand.has(v);
    }, Foo;
}();
