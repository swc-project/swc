function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @target: esnext, es2022
// @useDefineForClassFields: false
class C {
    method() {
        console.log(_classPrivateFieldGet(this, _a));
        _classPrivateFieldSet(this, _a, "hello");
        console.log(_classPrivateFieldGet(this, _b));
    }
    static test() {
        console.log(_classStaticPrivateFieldSpecGet(this, C, _m));
        console.log(_classStaticPrivateFieldSpecSet(this, C, _x, "test"));
    }
    constructor(){
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: 10
        });
        _classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _something, {
            writable: true,
            value: ()=>1234
        });
        this.a = 123;
        this.c = "hello";
    }
}
var _a = new WeakMap();
var _b = new WeakMap();
var _m = {
    writable: true,
    value: "test"
};
var _x = {
    writable: true,
    value: void 0
};
var _something = new WeakMap();
