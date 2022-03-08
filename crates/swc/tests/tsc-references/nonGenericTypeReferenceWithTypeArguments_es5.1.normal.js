import * as swcHelpers from "@swc/helpers";
// Check that errors are reported for non-generic types with type arguments
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var E;
(function(E) {})(E || (E = {}));
var v1;
var v2;
var v3;
var v4;
function f() {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    var E;
    (function(E) {})(E || (E = {}));
    var v1;
    var v2;
    var v3;
    var v4;
    var v5;
}
