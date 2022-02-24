function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var _name = new WeakMap();
console.log(new class {
    getValue(x) {
        var _y = new WeakMap(), tmp = _classPrivateFieldGet(this, _name);
        return new class {
            [tmp]() {
                return x + _classPrivateFieldGet(this, _y);
            }
            constructor(){
                _classPrivateFieldInit(this, _y, {
                    writable: !0,
                    value: 100
                });
            }
        }()[_classPrivateFieldGet(this, _name)]();
    }
    constructor(name){
        _classPrivateFieldInit(this, _name, {
            writable: !0,
            value: void 0
        }), (function(receiver, privateMap, value) {
            var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
            (function(receiver, descriptor, value) {
                if (descriptor.set) descriptor.set.call(receiver, value);
                else {
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value;
                }
            })(receiver, descriptor, value);
        })(this, _name, name);
    }
}("NAME").getValue(100));
