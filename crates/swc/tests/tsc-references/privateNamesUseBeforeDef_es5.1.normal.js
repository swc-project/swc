import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
// @target: es2015
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _foo, {
        writable: true,
        value: _class_private_field_get(this, _bar)
    }) // Error
    ;
    _class_private_field_init(this, _bar, {
        writable: true,
        value: 3
    });
};
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakSet();
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
    _class_private_method_init(this, _bar1);
    _class_private_field_init(this, _foo1, {
        writable: true,
        value: _class_private_method_get(this, _bar1, bar).call(this)
    }) // No Error
    ;
};
function bar() {
    return 3;
}
var _foo2 = /*#__PURE__*/ new WeakMap(), _bar2 = /*#__PURE__*/ new WeakMap();
var A3 = function A3() {
    "use strict";
    _class_call_check(this, A3);
    _class_private_field_init(this, _bar2, {
        get: get_bar,
        set: void 0
    });
    _class_private_field_init(this, _foo2, {
        writable: true,
        value: _class_private_field_get(this, _bar2)
    }) // No Error
    ;
};
function get_bar() {
    return 3;
}
var _foo3 = /*#__PURE__*/ new WeakMap(), _bar3 = /*#__PURE__*/ new WeakMap();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
    _class_private_field_init(this, _foo3, {
        writable: true,
        value: _class_private_field_get(this, _bar3)
    }) // Error
    ;
    _class_private_field_init(this, _bar3, {
        writable: true,
        value: _class_private_field_get(this, _foo3)
    });
};
