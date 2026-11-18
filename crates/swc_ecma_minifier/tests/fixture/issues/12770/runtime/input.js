(function () {
    const cache = new WeakMap();
    class e {
        static lookup(key) {
            return cache.get(key);
        }
        static create(value) {
            return new e(value);
        }
        constructor(value) {
            this.value = value;
        }
    }
    cache.set(globalThis, "found");
    console.log(e.lookup(globalThis), e.name);
    console.log(e.create(1) instanceof e, e.create(2).value);
})();
