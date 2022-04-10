import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    swcHelpers.classCallCheck(this, Foo), this.property = 1;
}, SubFoo = function(Foo1) {
    swcHelpers.inherits(SubFoo, Foo1);
    var _super = swcHelpers.createSuper(SubFoo);
    function SubFoo() {
        return swcHelpers.classCallCheck(this, SubFoo), _super.apply(this, arguments);
    }
    return SubFoo;
}(Foo);
