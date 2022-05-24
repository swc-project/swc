import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
    return C[""] = function() {
        return new Foo;
    }, C;
}();
