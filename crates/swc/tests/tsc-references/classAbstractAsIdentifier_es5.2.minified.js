import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var abstract = function() {
    "use strict";
    function abstract() {
        _class_call_check(this, abstract);
    }
    return abstract.prototype.foo = function() {
        return 1;
    }, abstract;
}();
new abstract;
