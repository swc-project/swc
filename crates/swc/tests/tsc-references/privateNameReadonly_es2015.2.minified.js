var _bar;
const C = (_bar = new WeakSet(), class {
    foo() {
        var receiver, privateMap, value, descriptor;
        receiver = this, privateMap = _bar, value = console.log("should log this then throw"), descriptor = (function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            return privateMap.get(receiver);
        })(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
            if (descriptor.set) descriptor.set.call(receiver, value);
            else {
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                descriptor.value = value;
            }
        })(receiver, descriptor, value);
    }
    constructor(){
        (function(obj, privateSet) {
            (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateSet), privateSet.add(obj);
        })(this, _bar);
    }
});
console.log(new C().foo());
