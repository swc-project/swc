import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
var _foo = /*#__PURE__*/ new WeakSet(), _bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), __quux = /*#__PURE__*/ new WeakMap(), _quux = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
class A {
    constructor(){
        _class_private_method_init(this, _foo);
        _class_private_method_init(this, _bar);
        _class_private_method_init(this, _baz);
        _class_private_field_init(this, _quux, {
            get: get_quux,
            set: set_quux
        });
        _class_private_field_init(this, __quux, {
            writable: true,
            value: void 0
        });
        _class_private_method_get(this, _foo, foo).call(this, 30);
        _class_private_method_get(this, _bar, bar).call(this, 30);
        _class_private_method_get(this, _baz, baz).call(this, 30);
        _class_private_field_set(this, _quux, _class_private_field_get(this, _quux) + 1);
        _class_private_field_update(this, _quux).value++;
    }
}
function foo(a) {}
function bar(a) {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _async_to_generator(function*(a) {});
    return _bar1.apply(this, arguments);
}
function baz(a) {
    return _baz1.apply(this, arguments);
}
function _baz1() {
    _baz1 = _wrap_async_generator(function*(a) {
        return 3;
    });
    return _baz1.apply(this, arguments);
}
function get_quux() {
    return _class_private_field_get(this, __quux);
}
function set_quux(val) {
    _class_private_field_set(this, __quux, val);
}
var _foo1 = /*#__PURE__*/ new WeakSet();
class B extends A {
    constructor(){
        super();
        _class_private_method_init(this, _foo1);
        _class_private_method_get(this, _foo1, foo1).call(this, "str");
    }
}
function foo1(a) {}
