import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _class_static_private_field_update from "@swc/helpers/lib/_class_static_private_field_update.js";
var C = function() {
    "use strict";
    function C() {
        for(_class_call_check(this, C), _class_static_private_field_update(C, C, _test).value++, _class_static_private_field_update(C, C, _test).value--, ++_class_static_private_field_update(C, C, _test).value, --_class_static_private_field_update(C, C, _test).value, _class_static_private_field_update(C, C, _test).value++, _class_static_private_field_update(C, C, _test).value--, ++_class_static_private_field_update(C, C, _test).value, --_class_static_private_field_update(C, C, _test).value, _class_static_private_field_spec_set(C, C, _test, 0); 10 > _class_static_private_field_spec_get(C, C, _test); ++_class_static_private_field_update(C, C, _test).value);
        for(_class_static_private_field_spec_set(C, C, _test, 0); 10 > _class_static_private_field_spec_get(C, C, _test); _class_static_private_field_update(C, C, _test).value++);
    }
    var _proto = C.prototype;
    return _proto.test = function() {
        for(_class_static_private_field_update(this.getClass(), C, _test).value++, _class_static_private_field_update(this.getClass(), C, _test).value--, ++_class_static_private_field_update(this.getClass(), C, _test).value, --_class_static_private_field_update(this.getClass(), C, _test).value, _class_static_private_field_update(this.getClass(), C, _test).value++, _class_static_private_field_update(this.getClass(), C, _test).value--, ++_class_static_private_field_update(this.getClass(), C, _test).value, --_class_static_private_field_update(this.getClass(), C, _test).value, _class_static_private_field_spec_set(this.getClass(), C, _test, 0); 10 > _class_static_private_field_spec_get(this.getClass(), C, _test); ++_class_static_private_field_update(this.getClass(), C, _test).value);
        for(_class_static_private_field_spec_set(this.getClass(), C, _test, 0); 10 > _class_static_private_field_spec_get(this.getClass(), C, _test); _class_static_private_field_update(this.getClass(), C, _test).value++);
    }, _proto.getClass = function() {
        return C;
    }, C;
}(), _test = {
    writable: !0,
    value: 24
};
