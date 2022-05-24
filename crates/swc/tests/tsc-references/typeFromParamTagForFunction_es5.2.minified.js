import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
exports.A = function() {
    this.x = 1;
}, require("./a-ext").A, exports.B = function _class() {
    "use strict";
    _class_call_check(this, _class), this.x = 1;
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
    _class_call_check(this, E), this.x = 1;
};
var E = require("./e-ext").E, H = function() {
    "use strict";
    _class_call_check(this, H), this.x = 1;
};
