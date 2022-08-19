import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _sym = Symbol("_sym");
export var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass), this[_sym] = "ok";
    }
    var _proto = MyClass.prototype;
    return _proto.method = function() {
        this[_sym] = "yep", this[_sym];
    }, MyClass;
}();
