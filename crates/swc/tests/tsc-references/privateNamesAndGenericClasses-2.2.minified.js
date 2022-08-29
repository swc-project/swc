//// [privateNamesAndGenericClasses-2.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _foo = new WeakMap(), _bar = new WeakSet();
class C {
    set baz(t) {
        _class_private_field_set(this, _foo, t);
    }
    get baz() {
        return _class_private_field_get(this, _foo);
    }
    constructor(t){
        _class_private_method_init(this, _bar), _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, t), t = _class_private_method_get(this, _bar, function() {
            return _class_private_field_get(this, _foo);
        }).call(this);
    }
}
let a = new C(3), b = new C("hello");
a.baz = 5, a.baz, a.#foo, b = a = b;
