import * as swcHelpers from "@swc/helpers";
// @declaration: true
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.x = x;
};
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.x = x;
};
var E = function E(x) {
    "use strict";
    swcHelpers.classCallCheck(this, E);
    this.x = x;
};
var c = new C(1);
var d = new D(1); // error
var e = new E(1); // error
var Generic;
(function(Generic) {
    var C = function C(x) {
        "use strict";
        swcHelpers.classCallCheck(this, C);
        this.x = x;
    };
    var D = function D(x) {
        "use strict";
        swcHelpers.classCallCheck(this, D);
        this.x = x;
    };
    var E = function E(x) {
        "use strict";
        swcHelpers.classCallCheck(this, E);
        this.x = x;
    };
    var c = new C(1);
    var d = new D(1); // error
    var e = new E(1); // error
})(Generic || (Generic = {}));
