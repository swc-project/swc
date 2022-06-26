import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _sym = "my-fake-sym";
export var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass), this[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        this[_sym] = "yep", this[_sym];
    }, MyClass;
}();
