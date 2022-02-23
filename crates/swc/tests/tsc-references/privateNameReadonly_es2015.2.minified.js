const C = function() {
    var _bar = new WeakSet();
    return class {
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
            var obj, privateSet;
            obj = this, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateSet = _bar), privateSet.add(obj);
        }
    };
}();
console.log(new C().foo());
