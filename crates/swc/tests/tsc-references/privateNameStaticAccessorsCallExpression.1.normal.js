//// [privateNameStaticAccessorsCallExpression.ts]
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap(), _x = new WeakMap();
class A {
    static test() {
        var _this, _this1, _this2, _this3, _this4, _this5, _this_getClass;
        _this = this, _fieldFunc.get(_this).get.call(_this);
        const func = (_this1 = this, _fieldFunc.get(_this1).get.call(_this1));
        func();
        new (_this2 = this, _fieldFunc.get(_this2).get.call(_this2))();
        const arr = [
            1,
            2
        ];
        _this3 = this, _fieldFunc2.get(_this3).get.call(_this3, 0, ...arr, 3);
        const b = new (_this4 = this, _fieldFunc2.get(_this4).get.call(_this4))(0, ...arr, 3);
        const str = (_this5 = this, _fieldFunc2.get(_this5).get.call(_this5))`head${1}middle${2}tail`;
        (_this_getClass = this.getClass(), _fieldFunc2.get(_this_getClass).get.call(_this_getClass))`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
function get_fieldFunc() {
    return function() {
        A.#x = 10;
    };
}
function get_fieldFunc2() {
    return function(a, ...b) {};
}
_fieldFunc.set(A, {
    get: get_fieldFunc,
    set: void 0
});
_fieldFunc2.set(A, {
    get: get_fieldFunc2,
    set: void 0
});
_x.set(A, {
    writable: true,
    value: 1
});
