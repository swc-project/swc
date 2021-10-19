function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @target: es2015
class A {
    test() {
        var _ref;
        _classPrivateFieldGet(this, _fieldFunc).call(this);
        const func = _classPrivateFieldGet(this, _fieldFunc);
        func();
        new (_classPrivateFieldGet(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3);
        const b = new (_classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3);
        const str = _classPrivateFieldGet(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`;
        _classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _fieldFunc.set(this, {
            writable: true,
            value: function() {
                this.x = 10;
            }
        });
        _fieldFunc2.set(this, {
            writable: true,
            value: function(a, ...b) {
            }
        });
        this.x = 1;
    }
}
var _fieldFunc = new WeakMap();
var _fieldFunc2 = new WeakMap();
