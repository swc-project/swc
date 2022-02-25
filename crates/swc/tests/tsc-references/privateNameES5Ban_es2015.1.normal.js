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
var _field = new WeakMap(), _method = new WeakSet(), _acc = new WeakMap();
// @target: es5, es3
class A {
    constructor(){
        _classPrivateFieldInit(this, _field, {
            writable: true,
            value: 123
        });
        _classPrivateMethodInit(this, _method);
        _classPrivateFieldInit(this, _acc, {
            get: get_acc,
            set: set_acc
        });
    }
}
var _sField = {
    writable: true,
    value: "hello world"
};
var _sAcc = {
    get: get_sAcc,
    set: set_sAcc
};
function method() {}
function sMethod() {}
function get_acc() {
    return "";
}
function set_acc(x) {}
function get_sAcc() {
    return 0;
}
function set_sAcc(x) {}
