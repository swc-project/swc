function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
var _class, _class1;
var _foo = new WeakMap(), _foo2 = new WeakMap();
// @target: es2015
class B {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: (_class = class _class {
                constructor(){
                    console.log("hello");
                }
            }, _class.test = 123, _class)
        });
        _classPrivateFieldInit(this, _foo2, {
            writable: true,
            value: (_class1 = class Foo {
            }, _class1.otherClass = 123, _class1)
        });
    }
}
