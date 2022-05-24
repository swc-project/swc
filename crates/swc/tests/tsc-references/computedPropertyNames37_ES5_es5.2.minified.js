import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, Foo2 = function() {
    "use strict";
    _class_call_check(this, Foo2);
}, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {}
        }
    ]), C;
}();
