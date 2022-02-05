var _foo = new WeakSet();
new class {
    bar() {
        let x = function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            return descriptor.value = value, value;
        }(this, _foo, 84);
        console.log(x);
    }
    constructor(){
        _foo.add(this);
    }
}().bar();
