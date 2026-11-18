var _n = /*#__PURE__*/ new WeakMap(), _m = /*#__PURE__*/ new WeakSet(), _key = /*#__PURE__*/ new WeakSet(), _view = /*#__PURE__*/ new WeakMap();
class A {
    update(other) {
        _class_private_method_get(this, _m, m).call(this).n++;
        ++_class_private_method_get(this, _m, m).call(this).n;
        _class_private_method_get(this, _m, m).call(this).n--;
        --_class_private_method_get(this, _m, m).call(this).n;
        _class_private_method_get(other, _m, m).call(other).n++;
        _class_private_method_get(this, _m, m).call(this).a.n++;
        _class_private_method_get(this, _m, m).call(this).g().n++;
        _class_private_method_get(this, _m, m).call(this)[0]++;
        _class_private_method_get(this, _m, m).call(this).n++;
        this[_class_private_method_get(this, _key, key).call(this)]++;
        _class_private_method_get(this, _m, m).call(this)[_class_private_method_get(this, _key, key).call(this)]++;
        _class_private_method_get(this, _m, m).call(this, _class_private_method_get(this, _m, m).call(this)).n++;
        (()=>_class_private_method_get(this, _m, m).call(this))().n++;
        _class_private_field_get(this, _view).n++;
        _class_private_field_update(_class_private_field_get(this, _view), _n).value++;
        _class_private_field_update(_class_private_method_get(this, _m, m).call(this), _n).value++;
        ++_class_private_field_update(_class_private_method_get(this, _m, m).call(this), _n).value;
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
function m() {
    return this;
}
function key() {
    return "n";
}
function get_view() {
    return this;
}
