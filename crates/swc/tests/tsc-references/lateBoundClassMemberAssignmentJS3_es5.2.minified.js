import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _sym = Symbol("_sym");
export var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
        var self = this;
        self[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        var self = this;
        self[_sym] = "yep", self[_sym];
    }, MyClass;
}();
