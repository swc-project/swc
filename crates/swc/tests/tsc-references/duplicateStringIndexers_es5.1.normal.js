import * as swcHelpers from "@swc/helpers";
// it is an error to have duplicate index signatures of the same kind in a type
var test;
(function(test) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    var a;
})(test || (test = {}));
