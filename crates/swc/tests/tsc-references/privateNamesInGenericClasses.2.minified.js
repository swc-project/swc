//// [privateNamesInGenericClasses.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _foo = new WeakMap(), _method = new WeakSet(), _prop = new WeakMap();
class C {
    bar(x) {
        return _class_private_field_get(x, _foo);
    }
    bar2(x) {
        return _class_private_method_get(x, _method, method).call(x);
    }
    bar3(x) {
        return _class_private_field_get(x, _prop);
    }
    baz(x) {
        return _class_private_field_get(x, _foo);
    }
    baz2(x) {
        return _class_private_method_get(x, _method, method);
    }
    baz3(x) {
        return _class_private_field_get(x, _prop);
    }
    quux(x) {
        return _class_private_field_get(x, _foo);
    }
    quux2(x) {
        return _class_private_method_get(x, _method, method);
    }
    quux3(x) {
        return _class_private_field_get(x, _prop);
    }
    constructor(){
        _class_private_method_init(this, _method), _class_private_field_init(this, _prop, {
            get: get_prop,
            set: set_prop
        }), _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        });
    }
}
function method() {
    return _class_private_field_get(this, _foo);
}
function get_prop() {
    return _class_private_field_get(this, _foo);
}
function set_prop(value) {
    _class_private_field_set(this, _foo, value);
}
a.#foo, a.#method, a.#prop, b = a = b;
