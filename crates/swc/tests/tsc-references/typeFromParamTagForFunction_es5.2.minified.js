import * as swcHelpers from "@swc/helpers";
exports.A = function() {
    this.x = 1;
}, require("./a-ext").A, exports.B = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.x = 1;
}, require("./b-ext").B;
export function C() {
    this.x = 1;
}
require("./c-ext").C;
export var D = function() {
    this.x = 1;
};
require("./d-ext").D;
export var E = function() {
    "use strict";
    swcHelpers.classCallCheck(this, E), this.x = 1;
};
var E = require("./e-ext").E, H = function() {
    "use strict";
    swcHelpers.classCallCheck(this, H), this.x = 1;
};
