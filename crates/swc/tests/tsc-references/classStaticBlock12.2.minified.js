//// [classStaticBlock12.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _x = new WeakMap(), __ = new WeakMap();
class C {
}
_x.set(C, {
    writable: !0,
    value: 1
}), __.set(C, {
    writable: !0,
    value: _class_private_field_get(C, _x)
});
