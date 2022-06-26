import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noImplicitOverride: true
// @target: esnext
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(SubFoo, Foo);
    var _super = _create_super(SubFoo);
    function SubFoo() {
        _class_call_check(this, SubFoo);
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
    _inherits(StaticSubFoo, Foo);
    var _super = _create_super(StaticSubFoo);
    function StaticSubFoo() {
        _class_call_check(this, StaticSubFoo);
        return _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42;
StaticSubFoo.staticProperty = 42;
var Intermediate = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Intermediate, Foo);
    var _super = _create_super(Intermediate);
    function Intermediate() {
        _class_call_check(this, Intermediate);
        return _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo);
var Derived = /*#__PURE__*/ function(Intermediate) {
    "use strict";
    _inherits(Derived, Intermediate);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
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
    _inherits(StaticDerived, Intermediate);
    var _super = _create_super(StaticDerived);
    function StaticDerived() {
        _class_call_check(this, StaticDerived);
        return _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42;
StaticDerived.staticProperty = 42;
