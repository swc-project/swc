function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
// @target: es2015
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: 1
        });
    }
}
var _foo = new WeakMap();
var _foo = {
    writable: true,
    value: true
};
class B {
    test(x) {
        _classStaticPrivateFieldSpecGet(x, B, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
var _foo1 = {
    writable: true,
    value: true
};
