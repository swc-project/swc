import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
class B {
    test(x) {
        _class_static_private_field_spec_get(x, B, _foo);
    }
}
var _foo = {
    writable: !0,
    value: !0
};
