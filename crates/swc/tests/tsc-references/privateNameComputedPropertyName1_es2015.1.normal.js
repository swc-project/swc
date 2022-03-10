import * as swcHelpers from "@swc/helpers";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap(), _d = /*#__PURE__*/ new WeakMap(), _e = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
class A {
    test() {
        const data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        };
        const { [swcHelpers.classPrivateFieldGet(this, _a)]: a , [swcHelpers.classPrivateFieldGet(this, _b)]: b , [swcHelpers.classPrivateFieldGet(this, _c)]: c , [swcHelpers.classPrivateFieldGet(this, _d)]: d , [swcHelpers.classPrivateFieldSet(this, _e, 'e')]: e ,  } = data;
        console.log(a, b, c, d, e);
        const a1 = data[swcHelpers.classPrivateFieldGet(this, _a)];
        const b1 = data[swcHelpers.classPrivateFieldGet(this, _b)];
        const c1 = data[swcHelpers.classPrivateFieldGet(this, _c)];
        const d1 = data[swcHelpers.classPrivateFieldGet(this, _d)];
        const e1 = data[swcHelpers.classPrivateFieldGet(this, _e)];
        console.log(a1, b1, c1, d1);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: true,
            value: 'a'
        });
        swcHelpers.classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _c, {
            writable: true,
            value: 'c'
        });
        swcHelpers.classPrivateFieldInit(this, _d, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _e, {
            writable: true,
            value: ''
        });
        swcHelpers.classPrivateFieldSet(this, _b, 'b');
        swcHelpers.classPrivateFieldSet(this, _d, 'd');
    }
}
new A().test();
