import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
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
