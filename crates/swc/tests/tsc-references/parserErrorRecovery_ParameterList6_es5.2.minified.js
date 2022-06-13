import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype.banana = function(x) {}, Foo;
}();
