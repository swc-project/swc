(function () {
    const cache = new WeakMap();
    class o {
        static lookup(key) {
            return cache.get(key);
        }
    }
    cache.set(globalThis, "found");
    console.log(o.lookup(globalThis), o.name);
})();
