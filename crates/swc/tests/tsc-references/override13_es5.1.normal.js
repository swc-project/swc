import * as swcHelpers from "@swc/helpers";
// @noImplicitOverride: true
// @target: esnext
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
    this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(SubFoo, Foo);
    var _super = swcHelpers.createSuper(SubFoo);
    function SubFoo() {
        swcHelpers.classCallCheck(this, SubFoo);
        var _this;
        _this = _super.apply(this, arguments);
        _this.property = 42;
        _this.staticProperty = 42;
        return _this;
    }
    return SubFoo;
}(Foo);
var StaticSubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(StaticSubFoo, Foo);
    var _super = swcHelpers.createSuper(StaticSubFoo);
    function StaticSubFoo() {
        swcHelpers.classCallCheck(this, StaticSubFoo);
        return _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42;
StaticSubFoo.staticProperty = 42;
var Intermediate = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Intermediate, Foo);
    var _super = swcHelpers.createSuper(Intermediate);
    function Intermediate() {
        swcHelpers.classCallCheck(this, Intermediate);
        return _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo);
var Derived = /*#__PURE__*/ function(Intermediate) {
    "use strict";
    swcHelpers.inherits(Derived, Intermediate);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.property = 42;
        _this.staticProperty = 42;
        return _this;
    }
    return Derived;
}(Intermediate);
var StaticDerived = /*#__PURE__*/ function(Intermediate) {
    "use strict";
    swcHelpers.inherits(StaticDerived, Intermediate);
    var _super = swcHelpers.createSuper(StaticDerived);
    function StaticDerived() {
        swcHelpers.classCallCheck(this, StaticDerived);
        return _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42;
StaticDerived.staticProperty = 42;
