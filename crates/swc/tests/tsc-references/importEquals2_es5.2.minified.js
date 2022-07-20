import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
};
import * as a from "./a";
var a = require("./b");
new a.A(), module.exports = a;
