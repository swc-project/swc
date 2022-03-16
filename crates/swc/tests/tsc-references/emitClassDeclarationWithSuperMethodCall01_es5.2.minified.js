import * as swcHelpers from "@swc/helpers";
var Parent = function() {
    "use strict";
    function Parent() {
        swcHelpers.classCallCheck(this, Parent);
    }
    return Parent.prototype.foo = function() {}, Parent;
}(), Foo = function(Parent) {
    "use strict";
    swcHelpers.inherits(Foo, Parent);
    var _super = swcHelpers.createSuper(Foo);
    function Foo() {
        return swcHelpers.classCallCheck(this, Foo), _super.apply(this, arguments);
    }
    return Foo.prototype.foo = function() {}, Foo;
}(Parent);
