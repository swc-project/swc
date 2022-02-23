function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @target: esnext, es2022, es2015
class Foo {
    getValue(x) {
        const obj = this;
        var tmp = _classPrivateFieldGet(obj, _name);
        class Bar {
            [tmp]() {
                return x + _classPrivateFieldGet(this, _y);
            }
            constructor(){
                _classPrivateFieldInit(this, _y, {
                    writable: true,
                    value: 100
                });
            }
        }
        var _y = new WeakMap();
        return new Bar()[_classPrivateFieldGet(obj, _name)]();
    }
    constructor(name){
        _classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _name, name);
    }
}
var _name = new WeakMap();
console.log(new Foo("NAME").getValue(100));
