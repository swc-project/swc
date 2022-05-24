import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _sym = Symbol("_sym");
export var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass), this[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        this[_sym] = "yep", this[_sym];
    }, MyClass;
}();
