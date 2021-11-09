function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var c, d, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
};
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
foo(c, d), foo(d, c), foo(c, {
    x: "",
    foo: c
}), foo(null, null), foo({
}, null), foo(null, {
}), foo({
}, {
}), foo(function() {
}, function() {
}), foo(function() {
}, function() {
    return 1;
});
