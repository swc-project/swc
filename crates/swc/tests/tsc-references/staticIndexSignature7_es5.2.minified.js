import * as swcHelpers from "@swc/helpers";
var X = function() {
    swcHelpers.classCallCheck(this, X);
};
X.x = 12;
var Y = function() {
    function Y() {
        swcHelpers.classCallCheck(this, Y);
    }
    return Y.foo = function() {}, Y;
}();
