//// [privateNameStaticAccessorsCallExpression.ts]
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap(), _x = new WeakMap();
class A {
    static test() {
        var _this_getClass;
        _fieldFunc.get(this).get.call(this), _fieldFunc.get(this).get.call(this)(), new (_fieldFunc.get(this).get.call(this))();
        let arr = [
            1,
            2
        ];
        _fieldFunc2.get(this).get.call(this, 0, ...arr, 3), new (_fieldFunc2.get(this).get.call(this))(0, ...arr, 3), _fieldFunc2.get(this).get.call(this)`head${1}middle${2}tail`, (_this_getClass = this.getClass(), _fieldFunc2.get(_this_getClass).get.call(_this_getClass))`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
_fieldFunc.set(A, {
    get: function() {
        return function() {
            A.#x = 10;
        };
    },
    set: void 0
}), _fieldFunc2.set(A, {
    get: function() {
        return function(a) {};
    },
    set: void 0
}), _x.set(A, {
    writable: !0,
    value: 1
});
