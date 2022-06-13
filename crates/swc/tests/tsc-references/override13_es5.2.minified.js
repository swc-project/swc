import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.property = 1;
};
Foo.staticProperty = 2;
var SubFoo = function(Foo1) {
    "use strict";
    _inherits(SubFoo, Foo1);
    var _super = _create_super(SubFoo);
    function SubFoo() {
        var _this;
        return _class_call_check(this, SubFoo), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return SubFoo;
}(Foo), StaticSubFoo = function(Foo2) {
    "use strict";
    _inherits(StaticSubFoo, Foo2);
    var _super = _create_super(StaticSubFoo);
    function StaticSubFoo() {
        return _class_call_check(this, StaticSubFoo), _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42, StaticSubFoo.staticProperty = 42;
var Intermediate = function(Foo3) {
    "use strict";
    _inherits(Intermediate, Foo3);
    var _super = _create_super(Intermediate);
    function Intermediate() {
        return _class_call_check(this, Intermediate), _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo), Derived = function(Intermediate) {
    "use strict";
    _inherits(Derived, Intermediate);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.property = 42, _this.staticProperty = 42, _this;
    }
    return Derived;
}(Intermediate), StaticDerived = function(Intermediate) {
    "use strict";
    _inherits(StaticDerived, Intermediate);
    var _super = _create_super(StaticDerived);
    function StaticDerived() {
        return _class_call_check(this, StaticDerived), _super.apply(this, arguments);
    }
    return StaticDerived;
}(Intermediate);
StaticDerived.property = 42, StaticDerived.staticProperty = 42;
