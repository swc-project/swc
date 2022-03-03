var _x = new WeakMap();
class C {
    static test() {
        var receiver, privateMap, value, descriptor;
        receiver = new C(), value = 10, descriptor = (function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            return privateMap.get(receiver);
        })(receiver, privateMap = _x, "set"), (function(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        })(receiver, descriptor, value);
        const y = new C(), z = new y();
        z.x = 123;
    }
    constructor(){
        !function(obj, privateMap, value) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateMap), privateMap.set(obj, value);
        }(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
