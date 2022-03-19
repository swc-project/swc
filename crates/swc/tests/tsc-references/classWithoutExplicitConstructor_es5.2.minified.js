import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C), this.x = 1, this.y = 'hello';
};
new C(), new C(null);
var D = function() {
    "use strict";
    swcHelpers.classCallCheck(this, D), this.x = 2, this.y = null;
};
new D(), new D(null);
