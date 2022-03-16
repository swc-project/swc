import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
    swcHelpers.classCallCheck(this, C);
    this.x = x;
    var y = x;
};
var D = function D() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    swcHelpers.classCallCheck(this, D);
    this.y = y;
    var z = x;
};
var E = function E() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Date();
    swcHelpers.classCallCheck(this, E);
    var y = x;
};
