var _a = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap();
let A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _class_private_field_init(this, _c, {
            get: get_c,
            set: set_c
        });
        _class_private_field_init(this, _a, {
            writable: true,
            value: 1n
        });
    }
    _create_class(A, [
        {
            key: "foo",
            value: function foo() {
                let a = _class_private_field_update(this, _a).value++;
                a = ++_class_private_field_update(this, _a).value;
                let b = _class_private_field_update(this, _c).value++;
                b = ++_class_private_field_update(this, _c).value;
                console.log(a, b);
            }
        }
    ], [
        {
            key: "bar",
            value: function bar() {
                let d = _class_static_private_field_update(this, A, _d).value++;
                d = ++_class_static_private_field_update(this, A, _d).value;
                let e = _class_static_private_field_update(A, A, _d).value++;
                e = ++_class_static_private_field_update(A, A, _d).value;
                console.log(d, e);
            }
        }
    ]);
    return A;
}();
var _d = {
    get: get_d,
    set: set_d
};
var _b = {
    writable: true,
    value: 2n
};
function get_c() {
    return _class_private_field_get(this, _a);
}
function set_c(v) {
    _class_private_field_set(this, _a, v);
}
function get_d() {
    return _class_static_private_field_spec_get(this, A, _b);
}
function set_d(v) {
    _class_static_private_field_spec_set(this, A, _b, v);
}
const a = new A();
a.foo();
A.bar();
