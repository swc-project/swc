import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c, d, C = function() {
    "use strict";
    _class_call_check(this, C);
}, D = function() {
    "use strict";
    _class_call_check(this, D);
};
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(d, c), foo(function() {
    return 1;
}, function() {});
