//// [privateNamesUnique-1.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo1 = new WeakMap();
new class {
    constructor(){
        _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        });
    }
}();
