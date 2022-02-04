class Parent {
    accessChildProps() {
        !function(receiver, privateMap) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver).value;
        }(new Child(), _foo), (function(receiver, classConstructor, descriptor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            descriptor.value;
        })(Child, Parent, _bar);
    }
    constructor(){
        _foo.set(this, {
            writable: !0,
            value: 3
        });
    }
}
var _foo = new WeakMap(), _bar = {
    writable: !0,
    value: 5
};
class Child extends Parent {
    constructor(...args){
        super(...args), _foo1.set(this, {
            writable: !0,
            value: "foo"
        }), _bar1.set(this, {
            writable: !0,
            value: "bar"
        });
    }
}
var _foo1 = new WeakMap(), _bar1 = new WeakMap();
