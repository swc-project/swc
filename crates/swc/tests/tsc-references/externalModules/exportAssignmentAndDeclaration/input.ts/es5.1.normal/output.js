function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
export var E1;
(function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
})(E1 || (E1 = {
}));
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
// Invalid, as there is already an exported member.
module.exports = C1;
