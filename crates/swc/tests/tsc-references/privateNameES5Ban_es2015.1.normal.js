function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _method = new WeakSet(), _acc = new WeakSet(), _acc = new WeakSet();
// @target: es5, es3
class A {
    constructor(){
        _classPrivateFieldInit(this, _field, {
            writable: true,
            value: 123
        });
        _classPrivateMethodInit(this, _method);
        _classPrivateMethodInit(this, _acc);
        _classPrivateMethodInit(this, _acc);
    }
}
var _field = new WeakMap();
var _sField = {
    writable: true,
    value: "hello world"
};
function method() {}
function sMethod() {}
function acc() {
    return "";
}
function acc(x) {}
function sAcc() {
    return 0;
}
function sAcc(x) {}
