import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
