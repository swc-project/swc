//// [strictPropertyInitialization.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _f = new WeakMap(), _g = new WeakMap(), _h = new WeakMap(), _i = new WeakMap(), _d = new WeakMap(), _e = new WeakMap(), _f1 = new WeakMap(), _b = new WeakMap(), _b1 = new WeakMap(), _b2 = new WeakMap(), _d1 = new WeakMap(), _b3 = new WeakMap();
// Properties with non-undefined types require initialization
class C1 {
    constructor(){
        _class_private_field_init(this, _f, {
            writable: true,
            value: void 0
        }); //Error
        _class_private_field_init(this, _g, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _h, {
            writable: true,
            value: void 0
        }); //Error
        _class_private_field_init(this, _i, {
            writable: true,
            value: void 0
        });
    }
}
// No strict initialization checks for static members
class C3 {
}
// Initializer satisfies strict initialization check
class C4 {
    constructor(){
        _class_private_field_init(this, _d, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _e, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _f1, {
            writable: true,
            value: void 0
        });
        this.a = 0;
        this.b = 0;
        this.c = "abc";
        _class_private_field_set(this, _d, 0);
        _class_private_field_set(this, _e, 0);
        _class_private_field_set(this, _f1, "abc");
    }
}
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
        this.b = _class_private_field_get(this, _d1); //Error
        this.b = x;
        _class_private_field_set(this, _d1, x);
        let y = this.c;
    }
}
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
const a = 'a';
const b = Symbol();
class C12 {
    constructor(){
        this[a] = 1;
        this[b] = 1;
        this['c'] = 1;
    }
}
var E = /*#__PURE__*/ function(E) {
    E["A"] = "A";
    E["B"] = "B";
    return E;
}(E || {});
class C13 {
    constructor(){
        this["A"] = 1;
    }
}
