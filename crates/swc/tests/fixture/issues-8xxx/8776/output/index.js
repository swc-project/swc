import { _ as _class_static_private_field_spec_get } from "@swc/helpers/_/_class_static_private_field_spec_get";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
let capturedPrivateAccess;
let _ref = (class {
}, capturedPrivateAccess = ()=>_class_static_private_field_spec_get(A, A, _x));
class A {
}
var _x = {
    writable: true,
    value: 42
};
_define_property(A, _ref, void 0);
console.log(capturedPrivateAccess());
