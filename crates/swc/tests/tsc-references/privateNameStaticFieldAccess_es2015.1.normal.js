function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
// @target: es2015
class A {
    constructor(){
        console.log(_classStaticPrivateFieldSpecGet(A, A, _myField)); //Ok
        console.log(_classStaticPrivateFieldSpecGet(this, A, _myField)); //Error
    }
}
var _myField = {
    writable: true,
    value: "hello world"
};
