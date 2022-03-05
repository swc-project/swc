import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
// @target: es2015
class Parent {
    accessChildProps() {
        var _ref;
        swcHelpers.classPrivateFieldGet(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        swcHelpers.classStaticPrivateFieldSpecGet(Child, Parent, _bar); // Error: not found
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 3
        });
    }
}
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = new WeakMap(), _bar1 = new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: "foo"
        }) // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        ;
        swcHelpers.classPrivateFieldInit(this, _bar1, {
            writable: true,
            value: "bar"
        }) // OK
        ;
    }
}
new Parent().accessChildProps();
