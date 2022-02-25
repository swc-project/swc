function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    }(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A {
    constructor(){
        console.log(_classStaticPrivateFieldSpecGet(A, A, _myField)), console.log(_classStaticPrivateFieldSpecGet(this, A, _myField));
    }
}
var _myField = {
    writable: !0,
    value: "hello world"
};
