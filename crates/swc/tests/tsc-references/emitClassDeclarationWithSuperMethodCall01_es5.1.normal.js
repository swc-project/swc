import * as swcHelpers from "@swc/helpers";
var Parent = //@target: es6
/*#__PURE__*/ function() {
    "use strict";
    function Parent() {
        swcHelpers.classCallCheck(this, Parent);
    }
    var _proto = Parent.prototype;
    _proto.foo = function foo() {};
    return Parent;
}();
var Foo = /*#__PURE__*/ function(Parent) {
    "use strict";
    swcHelpers.inherits(Foo, Parent);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        return _super.apply(this, arguments);
    }
    var _proto = Foo.prototype;
    _proto.foo = function foo() {
        var _this = this;
        var x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(Foo.prototype), "foo", _this).call(_this);
        };
    };
    return Foo;
}(Parent);
