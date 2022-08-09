import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
}();
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _create_super(Bar);
    function Bar() {
        var _this;
        return _class_call_check(this, Bar), (_this = _super.call(this)).p = 2, _this;
    }
    return Bar;
}(Foo);
