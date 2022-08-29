//// [privateNamesInterfaceExtendingClass.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _prop = /*#__PURE__*/ new WeakMap();
class C {
    func(x) {
        _class_private_field_set(x, _prop, 123);
    }
    constructor(){
        _class_private_field_init(this, _prop, {
            writable: true,
            value: void 0
        });
    }
}
function func(x) {
    x.#prop = 123;
}
