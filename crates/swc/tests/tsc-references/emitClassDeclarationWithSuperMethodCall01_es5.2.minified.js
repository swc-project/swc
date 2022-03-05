import * as swcHelpers from "@swc/helpers";
var Parent = function() {
    "use strict";
    function Parent() {
        swcHelpers.classCallCheck(this, Parent);
    }
    return swcHelpers.createClass(Parent, [
        {
            key: "foo",
            value: function() {}
        }
    ]), Parent;
}(), Foo = function(Parent) {
    "use strict";
    swcHelpers.inherits(Foo, Parent);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        return swcHelpers.classCallCheck(this, Foo), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "foo",
            value: function() {}
        }
    ]), Foo;
}(Parent);
