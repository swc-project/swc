function _classApplyDescriptorGet(receiver, descriptor) {
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
class Parent {
    accessChildProps() {
        var receiver, privateMap, descriptor, receiver, classConstructor, descriptor;
        descriptor = (function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
            return privateMap.get(receiver);
        })(receiver = new Child(), privateMap = _foo, "get"), _classApplyDescriptorGet(receiver, descriptor), receiver = Child, classConstructor = Parent, descriptor = _bar, (function(receiver, classConstructor) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
        })(receiver, classConstructor), (function(descriptor, action) {
            if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
        })(descriptor, "get"), _classApplyDescriptorGet(receiver, descriptor);
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
new Parent().accessChildProps();
