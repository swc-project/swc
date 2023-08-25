//// [privateNamesUnique-5.ts]
// same as privateNamesUnique-1, but with an interface
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _foo1 = /*#__PURE__*/ new WeakMap();
new class {
    constructor(){
        _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        });
    }
}();
