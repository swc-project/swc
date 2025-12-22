var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap();
let A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _c.set(this, {
            get: get_c,
            set: set_c
        });
        _a.set(this, 1n);
    }
    _create_class(A, [
        {
            key: "foo",
            value: function foo() {
                var _this, _this1, _this2, _this3, _this4, _this5, _this6, _this7, _this8, _this9;
                let a = (_this = this, _this1 = _a.get(_this), _a.set(_this, _this1 + (typeof _this1 === "bigint" ? 1n : 1)), _this1);
                a = (_this2 = this, _this3 = (_this4 = _a.get(_this2)) + (typeof _this4 === "bigint" ? 1n : 1), _a.set(_this2, _this3), _this3);
                let b = (_this5 = this, _this6 = _c.get(_this5).get.call(_this5), _c.get(_this5).set.call(_this5, _this6 + (typeof _this6 === "bigint" ? 1n : 1)), _this6);
                b = (_this7 = this, _this8 = (_this9 = _c.get(_this7).get.call(_this7)) + (typeof _this9 === "bigint" ? 1n : 1), _c.get(_this7).set.call(_this7, _this8), _this8);
                console.log(a, b);
            }
        }
    ], [
        {
            key: "bar",
            value: function bar() {
                var _this, _this1, _this2, _this3, _this4, _A, _A1, _A2, _A3, _A4;
                let d = (_this = this, _this1 = _d.get(_this).get.call(_this), _d.get(_this).set.call(_this, _this1 + (typeof _this1 === "bigint" ? 1n : 1)), _this1);
                d = (_this2 = this, _this3 = (_this4 = _d.get(_this2).get.call(_this2)) + (typeof _this4 === "bigint" ? 1n : 1), _d.get(_this2).set.call(_this2, _this3), _this3);
                let e = (_A = A, _A1 = _d.get(_A).get.call(_A), _d.get(_A).set.call(_A, _A1 + (typeof _A1 === "bigint" ? 1n : 1)), _A1);
                e = (_A2 = A, _A3 = (_A4 = _d.get(_A2).get.call(_A2)) + (typeof _A4 === "bigint" ? 1n : 1), _d.get(_A2).set.call(_A2, _A3), _A3);
                console.log(d, e);
            }
        }
    ]);
    return A;
}();
function get_c() {
    return _a.get(this);
}
function set_c(v) {
    _a.set(this, v);
}
function get_d() {
    return _b.get(this);
}
function set_d(v) {
    _b.set(this, v);
}
_b.set(A, 2n);
_d.set(A, {
    get: get_d,
    set: set_d
});
const a = new A();
a.foo();
A.bar();
