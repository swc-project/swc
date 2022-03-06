function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap();
new class {
    test() {
        const data = {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e"
        }, { [_classPrivateFieldGet(this, _a)]: a , [_classPrivateFieldGet(this, _b)]: b , [_classPrivateFieldGet(this, _c)]: c , [_classPrivateFieldGet(this, _d)]: d , [_classPrivateFieldSet(this, _e, "e")]: e ,  } = data;
        console.log(a, b, c, d, e);
        const a1 = data[_classPrivateFieldGet(this, _a)], b1 = data[_classPrivateFieldGet(this, _b)], c1 = data[_classPrivateFieldGet(this, _c)], d1 = data[_classPrivateFieldGet(this, _d)];
        data[_classPrivateFieldGet(this, _e)], console.log(a1, b1, c1, d1);
    }
    constructor(){
        _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: "a"
        }), _classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _c, {
            writable: !0,
            value: "c"
        }), _classPrivateFieldInit(this, _d, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _e, {
            writable: !0,
            value: ""
        }), _classPrivateFieldSet(this, _b, "b"), _classPrivateFieldSet(this, _d, "d");
    }
}().test();
