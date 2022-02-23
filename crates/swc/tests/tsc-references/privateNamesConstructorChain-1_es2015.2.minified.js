function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
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
        _classPrivateFieldInit(this, _foo, {
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
        super(...args), _classPrivateFieldInit(this, _foo1, {
            writable: !0,
            value: "foo"
        }), _classPrivateFieldInit(this, _bar1, {
            writable: !0,
            value: "bar"
        });
    }
}
var _foo1 = new WeakMap(), _bar1 = new WeakMap();
