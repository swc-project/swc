import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: _class_private_field_get(this, _bar)
        }) // Error
        ;
        _class_private_field_init(this, _bar, {
            writable: true,
            value: 3
        });
    }
}
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakSet();
class A2 {
    constructor(){
        _class_private_method_init(this, _bar1);
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: _class_private_method_get(this, _bar1, bar).call(this)
        }) // No Error
        ;
    }
}
function bar() {
    return 3;
}
var _foo2 = /*#__PURE__*/ new WeakMap(), _bar2 = /*#__PURE__*/ new WeakMap();
class A3 {
    constructor(){
        _class_private_field_init(this, _bar2, {
            get: get_bar,
            set: void 0
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: _class_private_field_get(this, _bar2)
        }) // No Error
        ;
    }
}
function get_bar() {
    return 3;
}
var _foo3 = /*#__PURE__*/ new WeakMap(), _bar3 = /*#__PURE__*/ new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo3, {
            writable: true,
            value: _class_private_field_get(this, _bar3)
        }) // Error
        ;
        _class_private_field_init(this, _bar3, {
            writable: true,
            value: _class_private_field_get(this, _foo3)
        });
    }
}
