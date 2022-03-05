import * as swcHelpers from "@swc/helpers";
var D = function D() {
    "use strict";
    var widen = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
    swcHelpers.classCallCheck(this, D);
    this.widen = widen;
    this.noWiden = 1;
    this.noWiden = 5; // error
    this.widen = 6; // ok
};
new D(7); // ok
