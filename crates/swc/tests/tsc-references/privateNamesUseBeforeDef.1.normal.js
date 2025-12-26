//// [privateNamesUseBeforeDef.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        }); // Error
        _class_private_field_init(this, _bar, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, _class_private_field_get(this, _bar));
        _class_private_field_set(this, _bar, 3);
    }
}
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakSet();
class A2 {
    constructor(){
        _class_private_method_init(this, _bar1);
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0
        }); // No Error
        _class_private_field_set(this, _foo1, _class_private_method_get(this, _bar1, bar).call(this));
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
            value: void 0
        }); // No Error
        _class_private_field_set(this, _foo2, _class_private_field_get(this, _bar2));
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
            value: void 0
        }); // Error
        _class_private_field_init(this, _bar3, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo3, _class_private_field_get(this, _bar3));
        _class_private_field_set(this, _bar3, _class_private_field_get(this, _foo3));
    }
}
