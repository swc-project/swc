function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
var _class, _class1;
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
    value: (_class = class _class {
        constructor(){
            this.field = 10;
            console.log("hello");
            new (_classStaticPrivateFieldSpecGet(B, B, _foo2))();
        }
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_class1 = class Foo {
    }, _class1.otherClass = 123, _class1)
};
