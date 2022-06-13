import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
//@target: es6
var Parent = /*#__PURE__*/ function() {
    "use strict";
    function Parent() {
        _class_call_check(this, Parent);
    }
    var _proto = Parent.prototype;
    _proto.foo = function foo() {};
    return Parent;
}();
var Foo = /*#__PURE__*/ function(Parent) {
    "use strict";
    _inherits(Foo, Parent);
    var _super = _create_super(Foo);
    function Foo() {
        _class_call_check(this, Foo);
        return _super.apply(this, arguments);
    }
    var _proto = Foo.prototype;
    _proto.foo = function foo() {
        var _this = this;
        var x = function() {
            return _get(_get_prototype_of(Foo.prototype), "foo", _this).call(_this);
        };
    };
    return Foo;
}(Parent);
