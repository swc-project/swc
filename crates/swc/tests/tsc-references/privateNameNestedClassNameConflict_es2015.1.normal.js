function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _foo = new WeakMap();
// @target: es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        var _foo1 = new WeakMap();
        class A {
            constructor(){
                _classPrivateFieldInit(this, _foo1, {
                    writable: true,
                    value: void 0
                });
            }
        }
    }
}
