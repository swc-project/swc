let friendA;
var _x = new WeakMap();
friendA = {
    getX (obj) {
        return obj.#x;
    },
    setX (obj, value) {
        obj.#x = value;
    }
};
const a = new class {
    getX() {
        return (function(receiver, privateMap) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver).value;
        })(this, _x);
    }
    constructor(v){
        _x.set(this, {
            writable: !0,
            value: void 0
        }), (function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        })(this, _x, v);
    }
}(41);
new class {
    constructor(a1){
        const x = friendA.getX(a1);
        friendA.setX(a1, x + 1);
    }
}(a), a.getX();
