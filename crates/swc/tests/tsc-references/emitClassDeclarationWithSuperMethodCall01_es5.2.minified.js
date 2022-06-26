import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Parent = function() {
    "use strict";
    function Parent() {
        _class_call_check(this, Parent);
    }
    return Parent.prototype.foo = function() {}, Parent;
}(), Foo = function(Parent) {
    "use strict";
    _inherits(Foo, Parent);
    var _super = _create_super(Foo);
    function Foo() {
        return _class_call_check(this, Foo), _super.apply(this, arguments);
    }
    return Foo.prototype.foo = function() {}, Foo;
}(Parent);
