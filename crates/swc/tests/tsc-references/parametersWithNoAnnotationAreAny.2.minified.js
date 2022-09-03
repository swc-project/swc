//// [parametersWithNoAnnotationAreAny.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {
    return x;
}
var a, f = function(x) {
    return x;
}, f2 = function(x) {
    return x;
}, f3 = function(x) {
    return x;
}, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}(), b = {
    foo: function(x) {
        return x;
    },
    a: function(x) {
        return x;
    },
    b: function(x) {
        return x;
    }
};
