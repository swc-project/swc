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
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        _classPrivateMethodInit(this, _fooMethod);
        _classPrivateFieldInit(this, _fooProp, {
            get: get_fooProp,
            set: set_fooProp
        });
        _classPrivateFieldInit(this, _fooField, {
            writable: true,
            value: 3
        });
        this.bar = 3;
        this.baz = 3;
    }
}
function fooMethod() {}
function get_fooProp() {
    return 1;
}
function set_fooProp(value) {}
// `keyof A` should not include '#foo*'
let k = "bar"; // OK
k = "baz"; // OK
k = "#fooField"; // Error
k = "#fooMethod"; // Error
k = "#fooProp"; // Error
k = "fooField"; // Error
k = "fooMethod"; // Error
k = "fooProp"; // Error
