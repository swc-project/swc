import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.property = 1;
}, SubFoo = function(Foo1) {
    "use strict";
    _inherits(SubFoo, Foo1);
    var _super = _create_super(SubFoo);
    function SubFoo() {
        return _class_call_check(this, SubFoo), _super.apply(this, arguments);
    }
    return SubFoo;
}(Foo);
