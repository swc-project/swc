//// [ex.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Crunch = function() {
    "use strict";
    function Crunch(n) {
        _class_call_check(this, Crunch), this.n = n;
    }
    return Crunch.prototype.m = function() {
        return this.n;
    }, Crunch;
}();
//// [use.js]
var ex = require("./ex"), crunch = new ex.Crunch(1);
function f(wrap) {
    wrap.n;
}
crunch.n;
