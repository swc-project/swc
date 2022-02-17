function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class X {
    constructor(){
        _classStaticPrivateMethodGet(X, X, m).call(X);
    }
}
function m() {
    return _classStaticPrivateMethodGet({}, X, m).call(X), 1;
}
_classStaticPrivateMethodGet(X, X, m).call(X);
