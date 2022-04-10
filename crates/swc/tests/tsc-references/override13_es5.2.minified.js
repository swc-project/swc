import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    swcHelpers.classCallCheck(this, Foo), this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = function(Foo1) {
    swcHelpers.inherits(SubFoo, Foo1);
    var _super = swcHelpers.createSuper(SubFoo);
    function SubFoo() {
        var _this;
        return swcHelpers.classCallCheck(this, SubFoo), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return SubFoo;
}(Foo), StaticSubFoo = function(Foo2) {
    swcHelpers.inherits(StaticSubFoo, Foo2);
    var _super = swcHelpers.createSuper(StaticSubFoo);
    function StaticSubFoo() {
        return swcHelpers.classCallCheck(this, StaticSubFoo), _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42, StaticSubFoo.staticProperty = 42;
var Intermediate = function(Foo3) {
    swcHelpers.inherits(Intermediate, Foo3);
    var _super = swcHelpers.createSuper(Intermediate);
    function Intermediate() {
        return swcHelpers.classCallCheck(this, Intermediate), _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo), Derived = function(Intermediate) {
    swcHelpers.inherits(Derived, Intermediate);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return Derived;
}(Intermediate), StaticDerived = function(Intermediate) {
    swcHelpers.inherits(StaticDerived, Intermediate);
    var _super = swcHelpers.createSuper(StaticDerived);
    function StaticDerived() {
        return swcHelpers.classCallCheck(this, StaticDerived), _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42, StaticDerived.staticProperty = 42;
