import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.B = function() {
        return 42;
    }, A;
}();
export { A as default };
