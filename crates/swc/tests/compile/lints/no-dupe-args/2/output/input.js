var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_property = require("@swc/helpers/_/_define_property");
var foo = function foo(a, b, b) {};
(function(a, b, b) {});
(function(a, b, b) {})();
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar(a, b, b) {
        _class_call_check._(this, Bar);
        _define_property._(this, "foo", function(a, b, b) {});
    }
    _create_class._(Bar, [
        {
            key: "bar",
            value: function bar(a, b, b) {}
        }
    ]);
    return Bar;
}();
var baz = {
    foo: function foo(a, b, b) {},
    bar: function bar(a, b, b) {}
};
