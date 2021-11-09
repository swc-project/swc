function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function foo(x) {
}
foo({
}), foo({
});
var C = function(x) {
    "use strict";
    _classCallCheck(this, C), this.x = x;
};
function foo2(x) {
}
new C({
}), foo2({
}), foo2({
});
var C2 = function(x) {
    "use strict";
    _classCallCheck(this, C2), this.x = x;
};
new C2({
});
