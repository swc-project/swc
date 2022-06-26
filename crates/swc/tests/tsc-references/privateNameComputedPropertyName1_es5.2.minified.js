import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap(), A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), _class_private_field_init(this, _a, {
            writable: !0,
            value: "a"
        }), _class_private_field_init(this, _b, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _c, {
            writable: !0,
            value: "c"
        }), _class_private_field_init(this, _d, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _e, {
            writable: !0,
            value: ""
        }), _class_private_field_set(this, _b, "b"), _class_private_field_set(this, _d, "d");
    }
    return A.prototype.test = function() {
        var data = {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e"
        }, a = data[_class_private_field_get(this, _a)], b = data[_class_private_field_get(this, _b)], c = data[_class_private_field_get(this, _c)], d = data[_class_private_field_get(this, _d)], e = data[_class_private_field_set(this, _e, "e")];
        console.log(a, b, c, d, e);
        var a1 = data[_class_private_field_get(this, _a)], b1 = data[_class_private_field_get(this, _b)], c1 = data[_class_private_field_get(this, _c)], d1 = data[_class_private_field_get(this, _d)];
        data[_class_private_field_get(this, _e)], console.log(a1, b1, c1, d1);
    }, A;
}();
new A().test();
