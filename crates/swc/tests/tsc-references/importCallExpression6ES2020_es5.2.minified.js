import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
import(bar() ? "./0" : void 0), import(void 0), import(bar() ? "./1" : null), import(null);
