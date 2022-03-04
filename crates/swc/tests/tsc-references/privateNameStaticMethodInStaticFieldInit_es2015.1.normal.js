function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: es2015
class C {
}
C.s = _classStaticPrivateMethodGet(C, C, method).call(C);
function method() {
    return 42;
}
console.log(C.s);
