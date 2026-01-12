//// [privateNamesConstructorChain-2.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
import { _ as _class_static_private_field_spec_get } from "@swc/helpers/_/_class_static_private_field_spec_get";
var _foo = /*#__PURE__*/ new WeakMap();
class Parent {
    accessChildProps() {
        var _ref;
        _class_private_field_get(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        _class_static_private_field_spec_get(Child, Parent, _bar); // Error: not found
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, 3);
    }
}
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args), _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0 // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        }), _class_private_field_init(this, _bar1, {
            writable: true,
            value: void 0 // OK
        }), _class_private_field_set(this, _foo1, "foo"), _class_private_field_set(this, _bar1, "bar");
    }
}
new Parent().accessChildProps();
