import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo), this.property = 1;
};
Foo.staticProperty = 2;
var StaticSubFoo = function(Foo) {
    "use strict";
    _inherits(StaticSubFoo, Foo);
    var _super = _create_super(StaticSubFoo);
    function StaticSubFoo() {
        return _class_call_check(this, StaticSubFoo), _super.apply(this, arguments);
    }
    return StaticSubFoo;
}(Foo);
StaticSubFoo.property = 42, StaticSubFoo.staticProperty = 42;
var StaticDerived = function(Intermediate) {
    "use strict";
    _inherits(StaticDerived, Intermediate);
    var _super = _create_super(StaticDerived);
    function StaticDerived() {
        return _class_call_check(this, StaticDerived), _super.apply(this, arguments);
    }
    return StaticDerived;
}(function(Foo) {
    "use strict";
    _inherits(Intermediate, Foo);
    var _super = _create_super(Intermediate);
    function Intermediate() {
        return _class_call_check(this, Intermediate), _super.apply(this, arguments);
    }
    return Intermediate;
}(Foo));
StaticDerived.property = 42, StaticDerived.staticProperty = 42;
