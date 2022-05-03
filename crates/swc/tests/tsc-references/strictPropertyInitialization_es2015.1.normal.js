import * as swcHelpers from "@swc/helpers";
var _f = /*#__PURE__*/ new WeakMap(), _g = /*#__PURE__*/ new WeakMap(), _h = /*#__PURE__*/ new WeakMap(), _i = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target:es2015
// @declaration: true
// Properties with non-undefined types require initialization
class C1 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _f, {
            writable: true,
            value: void 0 //Error
        });
        swcHelpers.classPrivateFieldInit(this, _g, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _h, {
            writable: true,
            value: void 0 //Error
        });
        swcHelpers.classPrivateFieldInit(this, _i, {
            writable: true,
            value: void 0
        });
    }
}
// No strict initialization checks for static members
class C3 {
}
var _d = /*#__PURE__*/ new WeakMap(), _e = /*#__PURE__*/ new WeakMap(), _f1 = /*#__PURE__*/ new WeakMap();
// Initializer satisfies strict initialization check
class C4 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _d, {
            writable: true,
            value: 0
        });
        swcHelpers.classPrivateFieldInit(this, _e, {
            writable: true,
            value: 0
        });
        swcHelpers.classPrivateFieldInit(this, _f1, {
            writable: true,
            value: "abc"
        });
        this.a = 0;
        this.b = 0;
        this.c = "abc";
    }
}
var _b = /*#__PURE__*/ new WeakMap();
// Assignment in constructor satisfies strict initialization check
class C5 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 0;
        swcHelpers.classPrivateFieldSet(this, _b, 0);
    }
}
var _b1 = /*#__PURE__*/ new WeakMap();
// All code paths must contain assignment
class C6 {
    constructor(cond){
        swcHelpers.classPrivateFieldInit(this, _b1, {
            writable: true,
            value: void 0
        });
        if (cond) {
            return;
        }
        this.a = 0;
        swcHelpers.classPrivateFieldSet(this, _b1, 0);
    }
}
var _b2 = /*#__PURE__*/ new WeakMap();
class C7 {
    constructor(cond){
        swcHelpers.classPrivateFieldInit(this, _b2, {
            writable: true,
            value: void 0
        });
        if (cond) {
            this.a = 1;
            swcHelpers.classPrivateFieldSet(this, _b2, 1);
            return;
        }
        this.a = 0;
        swcHelpers.classPrivateFieldSet(this, _b2, 1);
    }
}
// Properties with string literal names aren't checked
class C8 {
}
// No strict initialization checks for abstract members
class C9 {
}
var _d1 = /*#__PURE__*/ new WeakMap();
// Properties with non-undefined types must be assigned before they can be accessed
// within their constructor
class C10 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _d1, {
            writable: true,
            value: void 0
        });
        let x = this.a; // Error
        this.a = this.b; // Error
        this.b = swcHelpers.classPrivateFieldGet(this, _d1 //Error
        );
        this.b = x;
        swcHelpers.classPrivateFieldSet(this, _d1, x);
        let y = this.c;
    }
}
var _b3 = /*#__PURE__*/ new WeakMap();
class C11 {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _b3, {
            writable: true,
            value: void 0
        });
        this.a = someValue();
        swcHelpers.classPrivateFieldSet(this, _b3, someValue());
    }
}
