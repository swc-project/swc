var _n = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _view = /*#__PURE__*/ new WeakMap();
class A {
    update(receiver) {
        _class_private_field_get(this, _view)[_class_private_field_update(this, _n).value++]++;
        (++_class_private_field_update(this, _n).value, _class_private_method_get(this, _m, m).call(this)).n++;
        _class_private_method_get(this, _m, m).call(this, _class_private_field_update(this, _n).value++).n++;
        _class_private_field_get(this, _view)[_class_private_field_set(this, _n, 1), "n"]++;
        _class_private_field_update(receiver(), _n).value++;
    }
    assign(receiver) {
        [_class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value = ++_class_private_field_update(this, _n).value] = [];
        ({ value: _class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value = _class_private_field_set(this, _n, 1) } = {});
        ({ [_class_private_field_update(this, _n).value++]: _class_private_field_destructure(_class_private_method_get(this, _m, m).call(this), _n).value } = {
            0: 1
        });
        [_class_private_field_destructure(receiver(), _n).value] = [
            1
        ];
        for (_class_private_field_get(this, _view)[_class_private_field_update(this, _n).value++] of [
            1,
            2
        ]){}
    }
    static update(receiver) {
        _class_static_private_field_spec_get(this, A, _staticView)[_class_static_private_field_update(this, A, _s).value++]++;
        (++_class_static_private_field_update(this, A, _s).value, _class_static_private_method_get(this, A, sm).call(A)).n++;
        _class_static_private_method_get(this, A, sm).call(A, _class_static_private_field_update(this, A, _s).value++).n++;
        _class_static_private_field_spec_get(this, A, _staticView)[_class_static_private_field_spec_set(this, A, _s, 1), "n"]++;
        _class_static_private_field_update(receiver(), A, _s).value++;
    }
    static assign(receiver) {
        [_class_static_private_field_destructure(_class_static_private_method_get(this, A, sm).call(A), A, _s).value = ++_class_static_private_field_update(this, A, _s).value] = [];
        ({ value: _class_static_private_field_destructure(_class_static_private_method_get(this, A, sm).call(A), A, _s).value = _class_static_private_field_spec_set(this, A, _s, 1) } = {});
        ({ [_class_static_private_field_update(this, A, _s).value++]: _class_static_private_field_destructure(_class_static_private_method_get(this, A, sm).call(A), A, _s).value } = {
            0: 1
        });
        [_class_static_private_field_destructure(receiver(), A, _s).value] = [
            1
        ];
        for (_class_static_private_field_spec_get(this, A, _staticView)[_class_static_private_field_update(this, A, _s).value++] of [
            1,
            2
        ]){}
    }
    constructor(){
        _class_private_method_init(this, _m);
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
var _staticView = {
    get: get_staticView,
    set: void 0
};
var _s = {
    writable: true,
    value: 0
};
function m() {
    return this;
}
function sm() {
    return this;
}
function get_view() {
    return this;
}
function get_staticView() {
    return this;
}
