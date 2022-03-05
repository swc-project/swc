import * as swcHelpers from "@swc/helpers";
function foo(x) {
    return x;
}
var i, b, c, i2, b2, c2, f2, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
foo(new Function()), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(i), foo(C), foo(b), foo(c);
var C2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x, y) {
    return x;
}), foo(i2), foo(C2), foo(b2), foo(c2), foo(f2);
