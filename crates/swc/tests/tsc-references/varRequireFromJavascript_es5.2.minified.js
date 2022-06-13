import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var ex, crunch, Crunch = function() {
    "use strict";
    function Crunch(n) {
        _class_call_check(this, Crunch), this.n = n;
    }
    return Crunch.prototype.m = function() {
        return this.n;
    }, Crunch;
}();
new (require("./ex")).Crunch(1).n;
