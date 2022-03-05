import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
class Parent {
    accessChildProps() {
        swcHelpers.classPrivateFieldGet(new Child(), _foo), swcHelpers.classStaticPrivateFieldSpecGet(Child, Parent, _bar);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: 3
        });
    }
}
var _bar = {
    writable: !0,
    value: 5
}, _foo1 = new WeakMap(), _bar1 = new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args), swcHelpers.classPrivateFieldInit(this, _foo1, {
            writable: !0,
            value: "foo"
        }), swcHelpers.classPrivateFieldInit(this, _bar1, {
            writable: !0,
            value: "bar"
        });
    }
}
