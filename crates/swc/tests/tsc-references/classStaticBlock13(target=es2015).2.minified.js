//// [classStaticBlock13.ts]
import { _ as _class_static_private_field_spec_get } from "@swc/helpers/_/_class_static_private_field_spec_get";
class C {
    foo() {
        return _class_static_private_field_spec_get(C, C, _x);
    }
}
var _x = {
    writable: !0,
    value: 123
};
console.log(_class_static_private_field_spec_get(C, C, _x));
