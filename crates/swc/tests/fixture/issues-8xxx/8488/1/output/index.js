import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "bar",
            value: function bar() {
                var _this = this;
                var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
                    var _this_a_b, _this_a;
                    return (_this_a = _this.a) === null || _this_a === void 0 ? void 0 : (_this_a_b = _this_a.b) === null || _this_a_b === void 0 ? void 0 : _this_a_b.c;
                }();
            }
        }
    ]);
    return Foo;
}();
new Foo().bar();
