import * as swcHelpers from "@swc/helpers";
var X = function() {
    "use strict";
    swcHelpers.classCallCheck(this, X);
};
X.x = 12;
var Y = function() {
    "use strict";
    function Y() {
        swcHelpers.classCallCheck(this, Y);
    }
    return Y.foo = function() {}, Y;
}();
