function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _method = new WeakSet();
// @target: es2015
class C {
    constructor(){
        _classPrivateMethodInit(this, _method);
    }
}
function method() {
    return 42;
}
C.s = new C().#method();
console.log(C.s);
