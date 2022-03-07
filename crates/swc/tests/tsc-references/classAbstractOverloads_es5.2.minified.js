import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.baz = function() {}, A;
}(), B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
