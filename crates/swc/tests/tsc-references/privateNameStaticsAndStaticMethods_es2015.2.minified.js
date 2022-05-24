import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _class_static_private_field_update from "@swc/helpers/lib/_class_static_private_field_update.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
class A {
    constructor(){
        _class_static_private_method_get(A, A, function(a) {}).call(A, 30), _class_static_private_method_get(A, A, bar).call(A, 30), _class_static_private_method_get(A, A, bar).call(A, 30), _class_static_private_field_spec_set(A, A, _quux, _class_static_private_field_spec_get(A, A, _quux) + 1), _class_static_private_field_update(A, A, _quux).value++;
    }
}
var _quux = {
    get: function() {
        return _class_static_private_field_spec_get(this, A, __quux);
    },
    set: function(val) {
        _class_static_private_field_spec_set(this, A, __quux, val);
    }
}, __quux = {
    writable: !0,
    value: void 0
};
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    return (_bar = _async_to_generator(function*(a) {})).apply(this, arguments);
}
class B extends A {
    constructor(){
        super(), _class_static_private_method_get(B, B, function(a) {}).call(B, "str");
    }
}
