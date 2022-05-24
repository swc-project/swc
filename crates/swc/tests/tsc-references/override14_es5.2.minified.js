import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
