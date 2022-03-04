function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var _class, _Foo;
// @target: es2015
class B {
    m() {
        console.log(_classStaticPrivateFieldSpecGet(B, B, _foo).test);
        _classStaticPrivateFieldSpecGet(B, B, _foo).test = 10;
        new (_classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    }
}
var _foo = {
    writable: true,
    value: (_class = class {
        constructor(){
            this.field = 10;
            console.log("hello");
            new (_classStaticPrivateFieldSpecGet(B, B, _foo2))();
        }
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_Foo = class Foo {
    }, _Foo.otherClass = 123, _Foo)
};
