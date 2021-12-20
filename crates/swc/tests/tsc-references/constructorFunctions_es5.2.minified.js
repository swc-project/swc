function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
function C1() {
    if (!_instanceof(this, C1)) return new C1();
    this.x = 1;
}
C1(), new C1();
var C2 = function() {
    if (!_instanceof(this, C2)) return new C2();
    this.x = 1;
};
function C3() {
    if (!_instanceof(this, C3)) return new C3();
}
C2(), new C2(), C3(), new C3();
var C4 = function() {
    if (!_instanceof(this, C4)) return new C4();
};
C4(), new C4(), new function() {
}(), new function _class() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, _class);
}(), new function() {
    this.functions = [
        function(x) {
            return x;
        },
        function(x) {
            return x + 1;
        },
        function(x) {
            return x - 1;
        }
    ];
}(), new function(num) {
}();
