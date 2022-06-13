import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
class B {
    test(x) {
        _class_static_private_field_spec_get(x, B, _foo);
    }
}
var _foo = {
    writable: !0,
    value: !0
};
