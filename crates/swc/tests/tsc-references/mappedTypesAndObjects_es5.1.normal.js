function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @strictNullChecks: true
// @declaration: true
function f1(x, y) {
    var obj;
    obj = x;
    obj = y;
}
function f2(x, y) {
    var obj;
    obj = x;
    obj = y;
}
function f3(x) {
    x = {
    };
}
var Form = function Form() {
    "use strict";
    _classCallCheck(this, Form);
    // Repro from #13747
    this.values = {
    };
};
