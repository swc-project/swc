function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
let friendA;
var _x = new WeakMap();
friendA = {
    getX (obj) {
        return _classPrivateFieldGet(obj, _x);
    },
    setX (obj, value) {
        _classPrivateFieldSet(obj, _x, value);
    }
};
const a = new class {
    getX() {
        return _classPrivateFieldGet(this, _x);
    }
    constructor(v){
        !function(obj, privateMap, value) {
            (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap), privateMap.set(obj, value);
        }(this, _x, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldSet(this, _x, v);
    }
}(41);
new class {
    constructor(a1){
        const x = friendA.getX(a1);
        friendA.setX(a1, x + 1);
    }
}(a), a.getX();
