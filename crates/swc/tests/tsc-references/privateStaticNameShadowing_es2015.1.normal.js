function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: es2015
class X {
    constructor(){
        _classStaticPrivateMethodGet(X, X, m).call(X);
    }
}
var _f = {
    writable: true,
    value: _classStaticPrivateMethodGet(X, X, m).call(X)
};
function m() {
    const X1 = {}; // shadow the class
    const _a = {}; // shadow the first generated var
    _classStaticPrivateMethodGet(X1, X, m).call(X); // Should check with X as the receiver with _b as the class constructor 
    return 1;
}
