const C = function() {
    var _bar = new WeakSet();
    return class {
        foo() {
            !function(receiver, privateMap, value) {
                if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                var descriptor = privateMap.get(receiver);
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                return descriptor.value = value, value;
            }(this, _bar, console.log("should log this then throw"));
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
