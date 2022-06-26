import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
