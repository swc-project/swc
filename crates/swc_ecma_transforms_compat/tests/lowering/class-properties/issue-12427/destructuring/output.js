var _n = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _key = /*#__PURE__*/ new WeakSet(), _view = /*#__PURE__*/ new WeakMap();
class A {
    assign(other) {
        var _class_private_method_get_call, _class_private_method_get_call1;
        [_class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value] = [
            1
        ];
        ({ value: _class_private_field_destructure(_class_private_method_get(other, _m, m).call(other), _n).value } = {
            value: 2
        });
        [_class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value = _class_private_field_get(_class_private_method_get_call = _class_private_method_get(this, _m, m).call(this), _n)] = [];
        [_class_private_field_destructure(_class_private_field_get(this, _view), _n).value] = [
            3
        ];
        [_class_private_field_destructure(this, _n).value, ..._class_private_field_destructure(_class_private_method_get(other, _m, m).call(other), _n).value] = [
            4,
            5,
            6
        ];
        ({ ..._class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value } = {
            n: 7
        });
        ({ [_class_private_method_get(this, _key, key).call(this)]: _class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value } = {
            n: 8
        });
        ({ value: _class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value = _class_private_field_get(_class_private_method_get_call1 = _class_private_method_get(this, _m, m).call(this), _n) } = {});
        for (_class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value of [
            9,
            10
        ]){}
    }
    static assign() {
        [_class_static_private_field_destructure(_class_static_private_method_get(this, A, receiver).call(A), A, _s).value] = [
            1
        ];
        ({ value: _class_static_private_field_destructure(_class_static_private_method_get(A, A, receiver).call(A), A, _s).value } = {
            value: 2
        });
        [_class_static_private_field_destructure(_class_static_private_method_get(this, A, receiver).call(A), A, _s).value = _class_static_private_field_spec_get(_class_static_private_method_get(this, A, receiver).call(A), A, _s)] = [];
    }
    constructor(){
        _class_private_method_init(this, _m);
        _class_private_method_init(this, _key);
        _class_private_field_init(this, _view, {
            get: get_view,
            set: void 0
        });
        _class_private_field_init(this, _n, {
            writable: true,
            value: 0
        });
    }
}
var _s = {
    writable: true,
    value: 0
};
function m() {
    return this;
}
function key() {
    return "n";
}
function get_view() {
    return this;
}
function receiver() {
    return this;
}
