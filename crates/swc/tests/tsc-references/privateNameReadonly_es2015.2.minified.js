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
            _bar.add(this);
        }
    };
}();
console.log(new C().foo());
