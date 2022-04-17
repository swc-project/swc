import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap();
new class {
    test() {
        let data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        }, { [swcHelpers.classPrivateFieldGet(this, _a)]: a , [swcHelpers.classPrivateFieldGet(this, _b)]: b , [swcHelpers.classPrivateFieldGet(this, _c)]: c , [swcHelpers.classPrivateFieldGet(this, _d)]: d , [swcHelpers.classPrivateFieldSet(this, _e, 'e')]: e ,  } = data;
        console.log(a, b, c, d, e);
        let a1 = data[swcHelpers.classPrivateFieldGet(this, _a)], b1 = data[swcHelpers.classPrivateFieldGet(this, _b)], c1 = data[swcHelpers.classPrivateFieldGet(this, _c)], d1 = data[swcHelpers.classPrivateFieldGet(this, _d)];
        data[swcHelpers.classPrivateFieldGet(this, _e)], console.log(a1, b1, c1, d1);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 'a'
        }), swcHelpers.classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _c, {
            writable: !0,
            value: 'c'
        }), swcHelpers.classPrivateFieldInit(this, _d, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _e, {
            writable: !0,
            value: ''
        }), swcHelpers.classPrivateFieldSet(this, _b, 'b'), swcHelpers.classPrivateFieldSet(this, _d, 'd');
    }
}().test();
