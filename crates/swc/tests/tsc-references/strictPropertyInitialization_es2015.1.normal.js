function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
// @strict: true
// @target:es2015
// @declaration: true
// Properties with non-undefined types require initialization
class C1 {
    constructor(){
        _classPrivateFieldInit(this, _f, {
            writable: true,
            value: void 0 //Error
        });
        _classPrivateFieldInit(this, _g, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _h, {
            writable: true,
            value: void 0 //Error
        });
        _classPrivateFieldInit(this, _i, {
            writable: true,
            value: void 0
        });
    }
}
var _f = new WeakMap();
var _g = new WeakMap();
var _h = new WeakMap();
var _i = new WeakMap();
// No strict initialization checks for static members
class C3 {
}
// Initializer satisfies strict initialization check
class C4 {
    constructor(){
        _classPrivateFieldInit(this, _d, {
            writable: true,
            value: 0
        });
        _classPrivateFieldInit(this, _e, {
            writable: true,
            value: 0
        });
        _classPrivateFieldInit(this, _f1, {
            writable: true,
            value: "abc"
        });
        this.a = 0;
        this.b = 0;
        this.c = "abc";
    }
}
var _d = new WeakMap();
var _e = new WeakMap();
var _f1 = new WeakMap();
// Assignment in constructor satisfies strict initialization check
class C5 {
    constructor(){
        _classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 0;
        _classPrivateFieldSet(this, _b, 0);
    }
}
var _b = new WeakMap();
// All code paths must contain assignment
class C6 {
    constructor(cond){
        _classPrivateFieldInit(this, _b1, {
            writable: true,
            value: void 0
        });
        if (cond) {
            return;
        }
        this.a = 0;
        _classPrivateFieldSet(this, _b1, 0);
    }
}
var _b1 = new WeakMap();
class C7 {
    constructor(cond){
        _classPrivateFieldInit(this, _b2, {
            writable: true,
            value: void 0
        });
        if (cond) {
            this.a = 1;
            _classPrivateFieldSet(this, _b2, 1);
            return;
        }
        this.a = 0;
        _classPrivateFieldSet(this, _b2, 1);
    }
}
var _b2 = new WeakMap();
// Properties with string literal names aren't checked
class C8 {
}
// No strict initialization checks for abstract members
class C9 {
}
// Properties with non-undefined types must be assigned before they can be accessed
// within their constructor
class C10 {
    constructor(){
        _classPrivateFieldInit(this, _d1, {
            writable: true,
            value: void 0
        });
        let x = this.a; // Error
        this.a = this.b; // Error
        this.b = _classPrivateFieldGet(this, _d1 //Error
        );
        this.b = x;
        _classPrivateFieldSet(this, _d1, x);
        let y = this.c;
    }
}
var _d1 = new WeakMap();
class C11 {
    constructor(){
        _classPrivateFieldInit(this, _b3, {
            writable: true,
            value: void 0
        });
        this.a = someValue();
        _classPrivateFieldSet(this, _b3, someValue());
    }
}
var _b3 = new WeakMap();
