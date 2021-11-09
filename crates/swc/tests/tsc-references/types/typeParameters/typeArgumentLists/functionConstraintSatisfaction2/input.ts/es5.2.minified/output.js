function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function foo(x) {
    return x;
}
function foo2(x) {
    return x;
}
foo(1), foo(function() {
}, 1), foo(1, function() {
});
var b, b2, f2, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, C2 = function() {
    "use strict";
    _classCallCheck(this, C2);
};
foo2(new Function()), foo2(function(x) {
    return x;
}), foo2(C), foo2(b), foo2(function(x) {
    return x;
}), foo2(function(x, y) {
    return x;
}), foo2(C2), foo2(b2), foo2(f2);
