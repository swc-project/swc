import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var i, Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype.y = function() {}, _create_class(Foo, [
        {
            key: "Z",
            get: function() {
                return 1;
            }
        }
    ]), Foo;
}();
i.x, i.y(), i.Z;
