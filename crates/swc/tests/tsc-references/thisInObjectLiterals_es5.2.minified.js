import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
    }
    return MyClass.prototype.fn = function() {
        this.t;
    }, MyClass;
}();
