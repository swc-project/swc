var Generic;
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
!function(Generic) {
    var c = new class {
        get y() {
            return 1;
        }
        set y(v) {}
    }();
    c.y = c.y;
    var _value = new WeakMap();
    new class {
        get value() {
            var receiver, privateMap, descriptor, receiver, descriptor;
            return receiver = this, (descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _value, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
        }
        set value(value) {
            var receiver, privateMap, value1, descriptor;
            receiver = this, privateMap = _value, value1 = value, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value1) {
                if (descriptor.set) descriptor.set.call(receiver, value1);
                else {
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value1;
                }
            })(receiver, descriptor, value1);
        }
        constructor(){
            var obj, privateMap, value1;
            obj = this, value1 = {
                writable: !0,
                value: void 0
            }, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap = _value), privateMap.set(obj, value1);
        }
    }().value = 3;
}(Generic || (Generic = {}));
