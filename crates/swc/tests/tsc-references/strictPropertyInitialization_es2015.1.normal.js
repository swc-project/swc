import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _f = /*#__PURE__*/ new WeakMap(), _g = /*#__PURE__*/ new WeakMap(), _h = /*#__PURE__*/ new WeakMap(), _i = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target:es2015
// @declaration: true
// Properties with non-undefined types require initialization
class C1 {
    constructor(){
        _class_private_field_init(this, _f, {
            writable: true,
            value: void 0 //Error
        });
        _class_private_field_init(this, _g, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _h, {
            writable: true,
            value: void 0 //Error
        });
        _class_private_field_init(this, _i, {
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
        this.a = 0;
        this.b = 0;
        this.c = "abc";
        _class_private_field_init(this, _d, {
            writable: true,
            value: 0
        });
        _class_private_field_init(this, _e, {
            writable: true,
            value: 0
        });
        _class_private_field_init(this, _f1, {
            writable: true,
            value: "abc"
        });
    }
}
var _b = /*#__PURE__*/ new WeakMap();
// Assignment in constructor satisfies strict initialization check
class C5 {
    constructor(){
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
        this.a = 0;
        _class_private_field_set(this, _b, 0);
    }
}
var _b1 = /*#__PURE__*/ new WeakMap();
// All code paths must contain assignment
class C6 {
    constructor(cond){
        _class_private_field_init(this, _b1, {
            writable: true,
            value: void 0
        });
        if (cond) {
            return;
        }
        this.a = 0;
        _class_private_field_set(this, _b1, 0);
    }
}
var _b2 = /*#__PURE__*/ new WeakMap();
class C7 {
    constructor(cond){
        _class_private_field_init(this, _b2, {
            writable: true,
            value: void 0
        });
        if (cond) {
            this.a = 1;
            _class_private_field_set(this, _b2, 1);
            return;
        }
        this.a = 0;
        _class_private_field_set(this, _b2, 1);
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
        _class_private_field_init(this, _d1, {
            writable: true,
            value: void 0
        });
        let x = this.a; // Error
        this.a = this.b; // Error
        this.b = _class_private_field_get(this, _d1 //Error
        );
        this.b = x;
        _class_private_field_set(this, _d1, x);
        let y = this.c;
    }
}
var _b3 = /*#__PURE__*/ new WeakMap();
class C11 {
    constructor(){
        _class_private_field_init(this, _b3, {
            writable: true,
            value: void 0
        });
        this.a = someValue();
        _class_private_field_set(this, _b3, someValue());
    }
}
