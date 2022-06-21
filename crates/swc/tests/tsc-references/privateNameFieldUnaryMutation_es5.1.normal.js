import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
var _test = /*#__PURE__*/ new WeakMap();
// @target: es2015
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        _class_private_field_init(this, _test, {
            writable: true,
            value: 24
        });
        _class_private_field_update(this, _test).value++;
        _class_private_field_update(this, _test).value--;
        ++_class_private_field_update(this, _test).value;
        --_class_private_field_update(this, _test).value;
        var a = _class_private_field_update(this, _test).value++;
        var b = _class_private_field_update(this, _test).value--;
        var c = ++_class_private_field_update(this, _test).value;
        var d = --_class_private_field_update(this, _test).value;
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; ++_class_private_field_update(this, _test).value){}
        for(_class_private_field_set(this, _test, 0); _class_private_field_get(this, _test) < 10; _class_private_field_update(this, _test).value++){}
    }
    var _proto = C.prototype;
    _proto.test = function test() {
        var _ref, _ref1;
        _class_private_field_update(this.getInstance(), _test).value++;
        _class_private_field_update(this.getInstance(), _test).value--;
        ++_class_private_field_update(this.getInstance(), _test).value;
        --_class_private_field_update(this.getInstance(), _test).value;
        var a = _class_private_field_update(this.getInstance(), _test).value++;
        var b = _class_private_field_update(this.getInstance(), _test).value--;
        var c = ++_class_private_field_update(this.getInstance(), _test).value;
        var d = --_class_private_field_update(this.getInstance(), _test).value;
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref = this.getInstance(), _test) < 10; ++_class_private_field_update(this.getInstance(), _test).value){}
        for(_class_private_field_set(this.getInstance(), _test, 0); _class_private_field_get(_ref1 = this.getInstance(), _test) < 10; _class_private_field_update(this.getInstance(), _test).value++){}
    };
    _proto.getInstance = function getInstance() {
        return new C();
    };
    return C;
}();
