function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    }(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class B {
    m() {
        console.log(_classStaticPrivateFieldSpecGet(B, B, _foo).test), _classStaticPrivateFieldSpecGet(B, B, _foo).test = 10, new (_classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    }
}
var _class, _class1, _foo = {
    writable: !0,
    value: ((_class = class {
        constructor(){
            this.field = 10, console.log("hello"), new (_classStaticPrivateFieldSpecGet(B, B, _foo2))();
        }
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_class1 = class {
    }).otherClass = 123, _class1)
};
