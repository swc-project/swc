import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _something = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022
// @useDefineForClassFields: false
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.a = 123;
        _class_private_field_init(this, _a, {
            writable: true,
            value: 10
        });
        this.c = "hello";
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _something, {
            writable: true,
            value: function() {
                return 1234;
            }
        });
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        console.log(_class_private_field_get(this, _a));
        _class_private_field_set(this, _a, "hello");
        console.log(_class_private_field_get(this, _b));
    };
    C.test = function test() {
        console.log(_class_static_private_field_spec_get(this, C, _m));
        console.log(_class_static_private_field_spec_set(this, C, _x, "test"));
    };
    return C;
}();
var _m = {
    writable: true,
    value: "test"
};
var _x = {
    writable: true,
    value: void 0
};
