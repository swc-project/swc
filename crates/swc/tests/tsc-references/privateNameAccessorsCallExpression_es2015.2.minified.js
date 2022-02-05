function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
var _fieldFunc = new WeakSet(), _fieldFunc2 = new WeakSet();
class A {
    test() {
        var _ref;
        _classPrivateMethodGet(this, _fieldFunc, fieldFunc).call(this);
        const func = _classPrivateMethodGet(this, _fieldFunc, fieldFunc);
        func(), new (_classPrivateMethodGet(this, _fieldFunc, fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classPrivateMethodGet(this, _fieldFunc2, fieldFunc2).call(this, 0, ...arr, 3), new (_classPrivateMethodGet(this, _fieldFunc2, fieldFunc2))(0, ...arr, 3), _classPrivateMethodGet(this, _fieldFunc2, fieldFunc2).bind(this)`head${1}middle${2}tail`, _classPrivateMethodGet(_ref = this.getInstance(), _fieldFunc2, fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        _fieldFunc.add(this), _fieldFunc2.add(this), this.x = 1;
    }
}
function fieldFunc() {
    return function() {
        this.x = 10;
    };
}
function fieldFunc2() {
    return function(a, ...b) {};
}
