//// [privateNamesConstructorChain-2.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), _bar = new WeakMap(), _foo1 = new WeakMap(), _bar1 = new WeakMap();
class Parent {
    accessChildProps() {
        _class_private_field_get(new Child(), _foo), _class_private_field_get(Child, _bar);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 3);
    }
}
class Child extends Parent {
    constructor(...args){
        _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _bar1, {
            writable: !0,
            value: void 0
        }), super(...args), _class_private_field_set(this, _foo1, "foo"), _class_private_field_set(this, _bar1, "bar");
    }
}
new Parent().accessChildProps();
