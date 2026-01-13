//// [privateNamesConstructorChain-2.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _class_static_private_field_spec_get } from "@swc/helpers/_/_class_static_private_field_spec_get";
var _foo = /*#__PURE__*/ new WeakMap();
class Parent {
    accessChildProps() {
        _class_private_field_get(new Child(), _foo), _class_static_private_field_spec_get(Child, Parent, _bar);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 3);
    }
}
var _bar = {
    writable: !0,
    value: 5
}, _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args), _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _bar1, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo1, "foo"), _class_private_field_set(this, _bar1, "bar");
    }
}
new Parent().accessChildProps();
