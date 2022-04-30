var _a = /*#__PURE__*/ new WeakMap(), _c = /*#__PURE__*/ new WeakMap();
let A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        _classPrivateFieldInit(this, _c, {
            get: get_c,
            set: set_c
        });
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: 1n
        });
    }
    _createClass(A, [
        {
            key: "foo",
            value: function foo() {
                let a = _classPrivateFieldUpdate(this, _a).value++;
                a = ++_classPrivateFieldUpdate(this, _a).value;
                let b = _classPrivateFieldUpdate(this, _c).value++;
                b = ++_classPrivateFieldUpdate(this, _c).value;
            }
        }
    ], [
        {
            key: "bar",
            value: function bar() {
                let d = _classStaticPrivateFieldUpdate(this, _d).value++;
                d = ++_classStaticPrivateFieldUpdate(this, _d).value;
                let e = _classStaticPrivateFieldUpdate(A, _d).value++;
                e = ++_classStaticPrivateFieldUpdate(A, _d).value;
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
    return _classPrivateFieldGet(this, _a);
}
function set_c(v) {
    _classPrivateFieldSet(this, _a, v);
}
function get_d() {
    return _classPrivateFieldGet(this, _a);
}
function set_d(v) {
    _classPrivateFieldSet(this, _a, v);
}
