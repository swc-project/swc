//// [classStaticBlock12.ts]
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
class C {
}
var _x = {
    writable: true,
    value: 1
};
(()=>{
    _class_static_private_field_spec_get(C, C, _x);
})();
