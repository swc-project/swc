import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = function Thing(p) {
    "use strict";
    _class_call_check(this, Thing), this.t = 12 + p;
};
