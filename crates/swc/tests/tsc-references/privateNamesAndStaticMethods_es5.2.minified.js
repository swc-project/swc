import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _class_static_private_field_update from "@swc/helpers/lib/_class_static_private_field_update.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    _class_call_check(this, A), _class_static_private_method_get(A, A, foo).call(A, 30), _class_static_private_method_get(A, A, bar).call(A, 30), _class_static_private_method_get(A, A, bar).call(A, 30), _class_static_private_field_spec_set(A, A, _quux, _class_static_private_field_spec_get(A, A, _quux) + 1), _class_static_private_field_update(A, A, _quux).value++;
}, _quux = {
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
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    return (_bar = _async_to_generator(regeneratorRuntime.mark(function _callee(a) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
var B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        var _this = _super.call(this);
        return _class_static_private_method_get(B, B, foo1).call(B, "str"), _this;
    }
    return B;
}(A);
function foo1(a) {}
