function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
// @target: esnext, es2015
class Foo {
    getValue(x) {
        const obj = this;
        var tmp = _classPrivateFieldGet(obj, _name);
        class Bar {
            [tmp]() {
                return x + _classPrivateFieldGet(this, _y);
            }
            constructor(){
                _y.set(this, {
                    writable: true,
                    value: 100
                });
            }
        }
        var _y = new WeakMap();
        return new Bar()[_classPrivateFieldGet(obj, _name)]();
    }
    constructor(name){
        _name.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _name, name);
    }
}
var _name = new WeakMap();
console.log(new Foo("NAME").getValue(100));
