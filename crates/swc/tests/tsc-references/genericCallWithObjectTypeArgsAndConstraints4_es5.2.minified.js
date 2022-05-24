import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
foo(c, d), foo(d, c), foo(c, {
    x: "",
    foo: c
}), foo(null, null), foo({}, null), foo(null, {}), foo({}, {}), foo(function() {}, function() {}), foo(function() {}, function() {
    return 1;
});
