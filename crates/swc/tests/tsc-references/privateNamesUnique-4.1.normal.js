//// [privateNamesUnique-4.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
class A1 {
}
var _something = /*#__PURE__*/ new WeakMap();
class C {
    constructor(){
        _class_private_field_init(this, _something, {
            writable: true,
            value: void 0
        });
    }
}
const c = a;
