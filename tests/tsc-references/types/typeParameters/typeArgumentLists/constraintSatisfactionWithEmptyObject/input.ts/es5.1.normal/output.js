function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// valid uses of a basic object constraint, no errors expected
// Object constraint
function foo(x) {
}
var r = foo({
});
var a = {
};
var r = foo({
});
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    this.x = x;
};
var r2 = new C({
});
var i;
// {} constraint
function foo2(x) {
}
var r = foo2({
});
var a = {
};
var r = foo2({
});
var C2 = function C2(x) {
    "use strict";
    _classCallCheck(this, C2);
    this.x = x;
};
var r2 = new C2({
});
var i2;
