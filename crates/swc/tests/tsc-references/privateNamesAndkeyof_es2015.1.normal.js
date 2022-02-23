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
var _fooMethod = new WeakSet(), _fooProp = new WeakSet(), _fooProp = new WeakSet();
// @strict: true
// @target: es6
class A {
    constructor(){
        _classPrivateFieldInit(this, _fooField, {
            writable: true,
            value: 3
        });
        _classPrivateMethodInit(this, _fooMethod);
        _classPrivateMethodInit(this, _fooProp);
        _classPrivateMethodInit(this, _fooProp);
        this.bar = 3;
        this.baz = 3;
    }
}
var _fooField = new WeakMap();
function fooMethod() {}
function fooProp() {
    return 1;
}
function fooProp(value) {}
// `keyof A` should not include '#foo*'
let k = "bar"; // OK
k = "baz"; // OK
k = "#fooField"; // Error
k = "#fooMethod"; // Error
k = "#fooProp"; // Error
k = "fooField"; // Error
k = "fooMethod"; // Error
k = "fooProp"; // Error
