var _foo = new WeakMap();
new class {
    bar() {
        var receiver, privateMap, value, descriptor;
        let x = (receiver = this, value = 84, descriptor = function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            return privateMap.get(receiver);
        }(receiver, privateMap = _foo, "set"), function(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        }(receiver, descriptor, value), value);
        console.log(x);
    }
    constructor(){
        !function(obj, privateMap, value) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateMap), privateMap.set(obj, value);
        }(this, _foo, {
            get: void 0,
            set: function(a) {}
        });
    }
}().bar();
