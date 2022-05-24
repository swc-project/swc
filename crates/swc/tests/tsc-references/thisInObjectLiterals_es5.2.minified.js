import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var MyClass = function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
    }
    return MyClass.prototype.fn = function() {
        this.t;
    }, MyClass;
}();
