class C {
    static test() {
        !function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            return descriptor.value = value, value;
        }(new C(), _x, 10);
        const y = new C(), z = new y();
        z.x = 123;
    }
    constructor(){
        _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
}
var _x = new WeakMap();
