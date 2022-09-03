//// [privateNamesUseBeforeDef.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _foo = new WeakMap(), _bar = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: _class_private_field_get(this, _bar)
        }), _class_private_field_init(this, _bar, {
            writable: !0,
            value: 3
        });
    }
}
var _foo1 = new WeakMap(), _bar1 = new WeakSet();
class A2 {
    constructor(){
        _class_private_method_init(this, _bar1), _class_private_field_init(this, _foo1, {
            writable: !0,
            value: _class_private_method_get(this, _bar1, bar).call(this)
        });
    }
}
function bar() {
    return 3;
}
var _foo2 = new WeakMap(), _bar2 = new WeakMap();
class A3 {
    constructor(){
        _class_private_field_init(this, _bar2, {
            get: get_bar,
            set: void 0
        }), _class_private_field_init(this, _foo2, {
            writable: !0,
            value: _class_private_field_get(this, _bar2)
        });
    }
}
function get_bar() {
    return 3;
}
var _foo3 = new WeakMap(), _bar3 = new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo3, {
            writable: !0,
            value: _class_private_field_get(this, _bar3)
        }), _class_private_field_init(this, _bar3, {
            writable: !0,
            value: _class_private_field_get(this, _foo3)
        });
    }
}
