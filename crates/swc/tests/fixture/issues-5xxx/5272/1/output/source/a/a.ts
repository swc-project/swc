Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Foo", {
    enumerable: true,
    get: function() {
        return Foo;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var _base = require("../b/base");
var Foo = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits._(Foo, Base);
    var _super = _create_super._(Foo);
    function Foo() {
        _class_call_check._(this, Foo);
        return _super.apply(this, arguments);
    }
    _create_class._(Foo, [
        {
            key: "bar",
            value: function bar() {
                return 1 + this.foo();
            }
        }
    ]);
    return Foo;
}(_base.Base);
