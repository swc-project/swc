const C = function() {
    var _x = new WeakSet();
    function x(x) {}
    return class {
        m() {
            !function(receiver, privateMap, value) {
                if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                var descriptor = privateMap.get(receiver);
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                return descriptor.value = value, value;
            }(this, _x, function(receiver, privateSet, fn) {
                if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                return fn;
            }(this, _x, x) + 2);
        }
        constructor(){
            _x.add(this);
        }
    };
}();
console.log(new C().m());
