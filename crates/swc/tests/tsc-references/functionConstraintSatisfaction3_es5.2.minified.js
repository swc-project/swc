import * as swcHelpers from "@swc/helpers";
function foo(x) {
    return x;
}
var i, c, i2, c2, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(i), foo(c);
var C2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(i2), foo(c2);
