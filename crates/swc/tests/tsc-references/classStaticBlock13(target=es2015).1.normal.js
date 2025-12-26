//// [classStaticBlock13.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _x = new WeakMap(), __ = new WeakMap();
class C {
    foo() {
        return _class_private_field_get(C, _x);
    }
}
_x.set(C, {
    writable: true,
    value: 123
});
__.set(C, {
    writable: true,
    value: console.log(_class_private_field_get(C, _x))
});
