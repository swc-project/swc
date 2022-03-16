import * as swcHelpers from "@swc/helpers";
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
    x = {};
}
// Repro from #13747
var Form = function Form() {
    "use strict";
    swcHelpers.classCallCheck(this, Form);
    this.values = {};
};
