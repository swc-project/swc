const C = function() {
    var _x = new WeakSet();
    function x(x) {}
    return class {
        m() {
            var receiver, privateMap, value, descriptor;
            receiver = this, privateMap = _x, value = (function(receiver, privateSet, fn) {
                if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                return fn;
            })(this, _x, x) + 2, descriptor = (function(receiver, privateMap, action) {
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
            })(obj, privateSet = _x), privateSet.add(obj);
        }
    };
}();
console.log(new C().m());
