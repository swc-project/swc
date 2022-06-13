import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap(), _d = /*#__PURE__*/ new WeakMap(), _e = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _class_private_field_init(this, _a, {
            writable: true,
            value: "a"
        });
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _c, {
            writable: true,
            value: "c"
        });
        _class_private_field_init(this, _d, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _e, {
            writable: true,
            value: ""
        });
        _class_private_field_set(this, _b, "b");
        _class_private_field_set(this, _d, "d");
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var data = {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e"
        };
        var a = data[_class_private_field_get(this, _a)], b = data[_class_private_field_get(this, _b)], c = data[_class_private_field_get(this, _c)], d = data[_class_private_field_get(this, _d)], e = data[_class_private_field_set(this, _e, "e")];
        console.log(a, b, c, d, e);
        var a1 = data[_class_private_field_get(this, _a)];
        var b1 = data[_class_private_field_get(this, _b)];
        var c1 = data[_class_private_field_get(this, _c)];
        var d1 = data[_class_private_field_get(this, _d)];
        var e1 = data[_class_private_field_get(this, _e)];
        console.log(a1, b1, c1, d1);
    };
    return A;
}();
new A().test();
