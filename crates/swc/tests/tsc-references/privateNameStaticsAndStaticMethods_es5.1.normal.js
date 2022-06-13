import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_field_update from "@swc/helpers/src/_class_static_private_field_update.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @strict: true
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_static_private_method_get(A, A, foo).call(A, 30);
    _class_static_private_method_get(A, A, bar).call(A, 30);
    _class_static_private_method_get(A, A, bar).call(A, 30);
    _class_static_private_field_spec_set(A, A, _quux, _class_static_private_field_spec_get(A, A, _quux) + 1);
    _class_static_private_field_update(A, A, _quux).value++;
};
var _quux = {
    get: get_quux,
    set: set_quux
};
var __quux = {
    writable: true,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = _async_to_generator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _bar.apply(this, arguments);
}
function baz(a) {
    return _baz.apply(this, arguments);
}
function _baz() {
    _baz = _wrap_async_generator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 3);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _baz.apply(this, arguments);
}
function get_quux() {
    return _class_static_private_field_spec_get(this, A, __quux);
}
function set_quux(val) {
    _class_static_private_field_spec_set(this, A, __quux, val);
}
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        var _this = _super.call(this);
        _class_static_private_method_get(B, B, foo1).call(B, "str");
        return _this;
    }
    return B;
}(A);
function foo1(a) {}
