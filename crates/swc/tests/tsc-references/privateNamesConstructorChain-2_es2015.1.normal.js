import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2015
class Parent {
    accessChildProps() {
        var _ref;
        _class_private_field_get(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        _class_static_private_field_spec_get(Child, Parent, _bar); // Error: not found
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 3
        });
    }
}
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = /*#__PURE__*/ new WeakMap(), _bar1 = /*#__PURE__*/ new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: "foo"
        }) // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        ;
        _class_private_field_init(this, _bar1, {
            writable: true,
            value: "bar"
        }) // OK
        ;
    }
}
new Parent().accessChildProps();
