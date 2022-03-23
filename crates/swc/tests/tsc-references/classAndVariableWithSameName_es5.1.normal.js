import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
} // error
;
var C = ""; // error
var M;
(function(M) {
    var D = function D() {
        "use strict";
        swcHelpers.classCallCheck(this, D);
    };
    var D = 1; // error
})(M || (M = {}));
