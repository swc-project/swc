import * as swcHelpers from "@swc/helpers";
var Generic, C = function(x) {
    swcHelpers.classCallCheck(this, C), this.x = x;
}, D = function(x) {
    swcHelpers.classCallCheck(this, D), this.x = x;
}, E = function(x) {
    swcHelpers.classCallCheck(this, E), this.x = x;
};
new C(1), new D(1), new E(1), function(Generic) {
    var C1 = function(x) {
        swcHelpers.classCallCheck(this, C1), this.x = x;
    }, D1 = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, D1), this.x = x;
    }, E1 = function(x) {
        "use strict";
        swcHelpers.classCallCheck(this, E1), this.x = x;
    };
    new C1(1), new D1(1), new E1(1);
}(Generic || (Generic = {}));
