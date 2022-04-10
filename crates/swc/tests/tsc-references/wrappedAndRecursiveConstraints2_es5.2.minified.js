import * as swcHelpers from "@swc/helpers";
var C = function(x) {
    swcHelpers.classCallCheck(this, C);
};
new C(1), new C(new C(""));
