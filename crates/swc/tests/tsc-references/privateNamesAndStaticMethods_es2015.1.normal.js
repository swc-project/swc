import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_field_update from "@swc/helpers/src/_class_static_private_field_update.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @strict: true
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
class A {
    constructor(){
        _class_static_private_method_get(A, A, foo).call(A, 30);
        _class_static_private_method_get(A, A, bar).call(A, 30);
        _class_static_private_method_get(A, A, bar).call(A, 30);
        _class_static_private_field_spec_set(A, A, _quux, _class_static_private_field_spec_get(A, A, _quux) + 1);
        _class_static_private_field_update(A, A, _quux).value++;
    }
}
var _quux = {
    get: get_quux,
    set: set_quux
};
var __quux = {
    writable: true,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = _async_to_generator(function*(a) {});
    return _bar.apply(this, arguments);
}
function baz(a) {
    return _baz.apply(this, arguments);
}
function _baz() {
    _baz = _wrap_async_generator(function*(a) {
        return 3;
    });
    return _baz.apply(this, arguments);
}
function get_quux() {
    return _class_static_private_field_spec_get(this, A, __quux);
}
function set_quux(val) {
    _class_static_private_field_spec_set(this, A, __quux, val);
}
class B extends A {
    constructor(){
        super();
        _class_static_private_method_get(B, B, foo1).call(B, "str");
    }
}
function foo1(a) {}
