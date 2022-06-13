import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var One = function() {
    "use strict";
    _class_call_check(this, One);
}, Two = function() {
    "use strict";
    _class_call_check(this, Two);
}, B = function(x, y) {
    return _class_call_check(this, B), null;
}, C = function(x, y) {
    return _class_call_check(this, C), null;
}, D = function(x, y) {
    return _class_call_check(this, D), null;
};
