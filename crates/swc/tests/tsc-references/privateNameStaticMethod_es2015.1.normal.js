function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @strict: true
// @target: es6
class A1 {
    constructor(){
        _classStaticPrivateMethodGet(A1, A1, method).call(A1, "");
        _classStaticPrivateMethodGet(A1, A1, method).call(A1, 1) // Error
        ;
        _classStaticPrivateMethodGet(A1, A1, method).call(A1) // Error 
        ;
    }
}
function method(param) {
    return "";
}
