import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return _create_class(Foo, [
        {
            key: "p",
            get: function() {
                return 1;
            },
            set: function(value) {}
        }
    ]), Foo;
}(), Bar = function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        var _this;
        return _class_call_check(this, Bar), (_this = _super.call(this)).p = 2, _this;
    }
    return Bar;
}(Foo);
