//// [strictPropertyInitialization.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _f = new WeakMap(), _g = new WeakMap(), _h = new WeakMap(), _i = new WeakMap();
class C1 {
    constructor(){
        _class_private_field_init(this, _f, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _g, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _h, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _i, {
            writable: !0,
            value: void 0
        });
    }
}
class C3 {
}
var _d = new WeakMap(), _e = new WeakMap(), _f1 = new WeakMap();
class C4 {
    constructor(){
        this.a = 0, this.b = 0, this.c = "abc", _class_private_field_init(this, _d, {
            writable: !0,
            value: 0
        }), _class_private_field_init(this, _e, {
            writable: !0,
            value: 0
        }), _class_private_field_init(this, _f1, {
            writable: !0,
            value: "abc"
        });
    }
}
var _b = new WeakMap();
class C5 {
    constructor(){
        _class_private_field_init(this, _b, {
            writable: !0,
            value: void 0
        }), this.a = 0, _class_private_field_set(this, _b, 0);
    }
}
var _b1 = new WeakMap();
class C6 {
    constructor(cond){
        if (_class_private_field_init(this, _b1, {
            writable: !0,
            value: void 0
        }), cond) return;
        this.a = 0, _class_private_field_set(this, _b1, 0);
    }
}
var _b2 = new WeakMap();
class C7 {
    constructor(cond){
        if (_class_private_field_init(this, _b2, {
            writable: !0,
            value: void 0
        }), cond) {
            this.a = 1, _class_private_field_set(this, _b2, 1);
            return;
        }
        this.a = 0, _class_private_field_set(this, _b2, 1);
    }
}
class C8 {
}
class C9 {
}
var _d1 = new WeakMap();
class C10 {
    constructor(){
        _class_private_field_init(this, _d1, {
            writable: !0,
            value: void 0
        });
        let x = this.a;
        this.a = this.b, this.b = _class_private_field_get(this, _d1), this.b = x, _class_private_field_set(this, _d1, x), this.c;
    }
}
var _b3 = new WeakMap();
class C11 {
    constructor(){
        _class_private_field_init(this, _b3, {
            writable: !0,
            value: void 0
        }), this.a = someValue(), _class_private_field_set(this, _b3, someValue());
    }
}
let a = 'a', b = Symbol();
class C12 {
    constructor(){
        this.a = 1, this[b] = 1, this.c = 1;
    }
}
