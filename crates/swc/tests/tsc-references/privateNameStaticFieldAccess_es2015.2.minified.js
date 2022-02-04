function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
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
