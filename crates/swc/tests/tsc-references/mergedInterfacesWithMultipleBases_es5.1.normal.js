import * as swcHelpers from "@swc/helpers";
// merged interfaces behave as if all extends clauses from each declaration are merged together
// no errors expected
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var a;
var r = a.a;
// generic interfaces in a module
var M;
(function(M) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
    };
    var C2 = function C2() {
        "use strict";
        swcHelpers.classCallCheck(this, C2);
    };
    var D = function D() {
        "use strict";
        swcHelpers.classCallCheck(this, D);
    };
})(M || (M = {}));
