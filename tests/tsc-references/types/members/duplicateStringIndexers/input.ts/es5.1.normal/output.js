function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// it is an error to have duplicate index signatures of the same kind in a type
var test;
(function(test) {
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var a;
})(test || (test = {
}));
