import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype.banana = function(x) {}, Foo;
}();
