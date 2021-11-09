function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
// @strict: true
// @target:es2015
// @declaration: true
// Properties with non-undefined types require initialization
class C1 {
    constructor(){
        _f.set(this, {
            writable: true,
            value: void 0 //Error
        });
        _g.set(this, {
            writable: true,
            value: void 0
        });
        _h.set(this, {
            writable: true,
            value: void 0 //Error
        });
        _i.set(this, {
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
        _d.set(this, {
            writable: true,
            value: 0
        });
        _e.set(this, {
            writable: true,
            value: 0
        });
        _f1.set(this, {
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
        _b.set(this, {
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
        _b1.set(this, {
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
    constructor(cond1){
        _b2.set(this, {
            writable: true,
            value: void 0
        });
        if (cond1) {
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
        _d1.set(this, {
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
        _b3.set(this, {
            writable: true,
            value: void 0
        });
        this.a = someValue();
        _classPrivateFieldSet(this, _b3, someValue());
    }
}
var _b3 = new WeakMap();
