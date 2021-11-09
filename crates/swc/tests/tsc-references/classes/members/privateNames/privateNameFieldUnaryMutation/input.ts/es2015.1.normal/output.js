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
// @target: es2015
class C {
    test() {
        var _ref, old, _ref1, old1, _ref2, _ref3, _ref4, old2, _ref5, old3, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, old4;
        _classPrivateFieldSet(_ref = this.getInstance(), _test, (old = +_classPrivateFieldGet(_ref, _test)) + 1), old;
        _classPrivateFieldSet(_ref1 = this.getInstance(), _test, (old1 = +_classPrivateFieldGet(_ref1, _test)) - 1), old1;
        _classPrivateFieldSet(_ref2 = this.getInstance(), _test, +_classPrivateFieldGet(_ref2, _test) + 1);
        _classPrivateFieldSet(_ref3 = this.getInstance(), _test, +_classPrivateFieldGet(_ref3, _test) - 1);
        const a = (_classPrivateFieldSet(_ref4 = this.getInstance(), _test, (old2 = +_classPrivateFieldGet(_ref4, _test)) + 1), old2);
        const b = (_classPrivateFieldSet(_ref5 = this.getInstance(), _test, (old3 = +_classPrivateFieldGet(_ref5, _test)) - 1), old3);
        const c = _classPrivateFieldSet(_ref6 = this.getInstance(), _test, +_classPrivateFieldGet(_ref6, _test) + 1);
        const d = _classPrivateFieldSet(_ref7 = this.getInstance(), _test, +_classPrivateFieldGet(_ref7, _test) - 1);
        for(_classPrivateFieldSet(this.getInstance(), _test, 0); _classPrivateFieldGet(_ref8 = this.getInstance(), _test) < 10; _classPrivateFieldSet(_ref9 = this.getInstance(), _test, +_classPrivateFieldGet(_ref9, _test) + 1)){
        }
        for(_classPrivateFieldSet(this.getInstance(), _test, 0); _classPrivateFieldGet(_ref10 = this.getInstance(), _test) < 10; _classPrivateFieldSet(_ref11 = this.getInstance(), _test, (old4 = +_classPrivateFieldGet(_ref11, _test)) + 1), old4){
        }
    }
    getInstance() {
        return new C();
    }
    constructor(){
        var old, old5, old6, old7, old8;
        _test.set(this, {
            writable: true,
            value: 24
        });
        _classPrivateFieldSet(this, _test, (old = +_classPrivateFieldGet(this, _test)) + 1), old;
        _classPrivateFieldSet(this, _test, (old5 = +_classPrivateFieldGet(this, _test)) - 1), old5;
        _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1);
        _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1);
        const a = (_classPrivateFieldSet(this, _test, (old6 = +_classPrivateFieldGet(this, _test)) + 1), old6);
        const b = (_classPrivateFieldSet(this, _test, (old7 = +_classPrivateFieldGet(this, _test)) - 1), old7);
        const c = _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1);
        const d = _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) - 1);
        for(_classPrivateFieldSet(this, _test, 0); _classPrivateFieldGet(this, _test) < 10; _classPrivateFieldSet(this, _test, +_classPrivateFieldGet(this, _test) + 1)){
        }
        for(_classPrivateFieldSet(this, _test, 0); _classPrivateFieldGet(this, _test) < 10; _classPrivateFieldSet(this, _test, (old8 = +_classPrivateFieldGet(this, _test)) + 1), old8){
        }
    }
}
var _test = new WeakMap();
