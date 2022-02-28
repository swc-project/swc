function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export class C {
    constructor(){
        !function(obj, privateSet) {
            _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
        }(this, _b), _classPrivateFieldInit(this, _c, {
            get: void 0,
            set: function(v) {
                var receiver, privateMap, descriptor, receiver, descriptor, receiver, privateMap, value, descriptor;
                receiver = this, privateMap = _a, receiver = this, value = ((descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _a, "get")).get ? descriptor.get.call(receiver) : descriptor.value) + v, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
                    if (descriptor.set) descriptor.set.call(receiver, value);
                    else {
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        descriptor.value = value;
                    }
                })(receiver, descriptor, value);
            }
        }), _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 1
        });
    }
}
