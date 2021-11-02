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
// @target: esnext, es2015
class A {
    test() {
        const data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        };
        const { [_classPrivateFieldGet(this, _a)]: a , [_classPrivateFieldGet(this, _b)]: b , [_classPrivateFieldGet(this, _c)]: c , [_classPrivateFieldGet(this, _d)]: d , [_classPrivateFieldSet(this, _e, 'e')]: e ,  } = data;
        console.log(a, b, c, d, e);
        const a1 = data[_classPrivateFieldGet(this, _a)];
        const b1 = data[_classPrivateFieldGet(this, _b)];
        const c1 = data[_classPrivateFieldGet(this, _c)];
        const d1 = data[_classPrivateFieldGet(this, _d)];
        const e1 = data[_classPrivateFieldGet(this, _e)];
        console.log(a1, b1, c1, d1);
    }
    constructor(){
        _a.set(this, {
            writable: true,
            value: 'a'
        });
        _b.set(this, {
            writable: true,
            value: void 0
        });
        _c.set(this, {
            writable: true,
            value: 'c'
        });
        _d.set(this, {
            writable: true,
            value: void 0
        });
        _e.set(this, {
            writable: true,
            value: ''
        });
        _classPrivateFieldSet(this, _b, 'b');
        _classPrivateFieldSet(this, _d, 'd');
    }
}
var _a = new WeakMap();
var _b = new WeakMap();
var _c = new WeakMap();
var _d = new WeakMap();
var _e = new WeakMap();
new A().test();
