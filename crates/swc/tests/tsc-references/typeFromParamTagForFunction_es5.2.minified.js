exports.A = function() {
    this.x = 1;
};
require("./a-ext").A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
exports.B = function _class() {
    "use strict";
    _class_call_check(this, _class), this.x = 1;
};
require("./b-ext").B;
export function C() {
    this.x = 1;
}
require("./c-ext").C;
export var D = function() {
    this.x = 1;
};
require("./d-ext").D;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var E = function E() {
    "use strict";
    _class_call_check(this, E), this.x = 1;
};
require("./e-ext").E;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
