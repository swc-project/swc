import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_field_update from "@swc/helpers/src/_class_static_private_field_update.mjs";
// @target: es2015
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        _class_static_private_field_update(C, C, _test).value++;
        _class_static_private_field_update(C, C, _test).value--;
        ++_class_static_private_field_update(C, C, _test).value;
        --_class_static_private_field_update(C, C, _test).value;
        var a = _class_static_private_field_update(C, C, _test).value++;
        var b = _class_static_private_field_update(C, C, _test).value--;
        var c = ++_class_static_private_field_update(C, C, _test).value;
        var d = --_class_static_private_field_update(C, C, _test).value;
        for(_class_static_private_field_spec_set(C, C, _test, 0); _class_static_private_field_spec_get(C, C, _test) < 10; ++_class_static_private_field_update(C, C, _test).value){}
        for(_class_static_private_field_spec_set(C, C, _test, 0); _class_static_private_field_spec_get(C, C, _test) < 10; _class_static_private_field_update(C, C, _test).value++){}
    }
    var _proto = C.prototype;
    _proto.test = function test() {
        _class_static_private_field_update(this.getClass(), C, _test).value++;
        _class_static_private_field_update(this.getClass(), C, _test).value--;
        ++_class_static_private_field_update(this.getClass(), C, _test).value;
        --_class_static_private_field_update(this.getClass(), C, _test).value;
        var a = _class_static_private_field_update(this.getClass(), C, _test).value++;
        var b = _class_static_private_field_update(this.getClass(), C, _test).value--;
        var c = ++_class_static_private_field_update(this.getClass(), C, _test).value;
        var d = --_class_static_private_field_update(this.getClass(), C, _test).value;
        for(_class_static_private_field_spec_set(this.getClass(), C, _test, 0); _class_static_private_field_spec_get(this.getClass(), C, _test) < 10; ++_class_static_private_field_update(this.getClass(), C, _test).value){}
        for(_class_static_private_field_spec_set(this.getClass(), C, _test, 0); _class_static_private_field_spec_get(this.getClass(), C, _test) < 10; _class_static_private_field_update(this.getClass(), C, _test).value++){}
    };
    _proto.getClass = function getClass() {
        return C;
    };
    return C;
}();
var _test = {
    writable: true,
    value: 24
};
