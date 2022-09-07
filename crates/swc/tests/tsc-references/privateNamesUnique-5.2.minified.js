//// [privateNamesUnique-5.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap();
new class {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        });
    }
}();
