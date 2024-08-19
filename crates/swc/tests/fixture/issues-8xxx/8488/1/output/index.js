var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check._(this, Foo);
    }
    _create_class._(Foo, [
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
