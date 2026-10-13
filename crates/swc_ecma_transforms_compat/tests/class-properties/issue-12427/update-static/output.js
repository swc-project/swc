class A {
    static update(other) {
        _class_static_private_method_get(this, A, m).call(A).n++;
        ++_class_static_private_method_get(this, A, m).call(A).n;
        _class_static_private_method_get(this, A, m).call(A).n--;
        --_class_static_private_method_get(this, A, m).call(A).n;
        _class_static_private_method_get(A, A, m).call(A).n++;
        _class_static_private_method_get(other, A, m).call(A).n++;
        _class_static_private_field_spec_get(this, A, _view).n++;
        _class_static_private_field_update(_class_static_private_field_spec_get(this, A, _view), A, _n).value++;
        _class_static_private_field_update(_class_static_private_method_get(this, A, m).call(A), A, _n).value++;
        ++_class_static_private_field_update(_class_static_private_method_get(A, A, m).call(A), A, _n).value;
    }
}
var _view = {
    get: get_view,
    set: void 0
};
var _n = {
    writable: true,
    value: 0
};
function m() {
    return this;
}
function get_view() {
    return this;
}
