import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @strict: true
// @noEmit: true
// @Filename: ex.js
export var Crunch = /*#__PURE__*/ function() {
    "use strict";
    function Crunch(n) {
        _class_call_check(this, Crunch);
        this.n = n;
    }
    var _proto = Crunch.prototype;
    _proto.m = function m() {
        return this.n;
    };
    return Crunch;
}();
// @Filename: use.js
var ex = require("./ex");
// values work
var crunch = new ex.Crunch(1);
crunch.n;
// types work
/**
 * @param {ex.Crunch} wrap
 */ function f(wrap) {
    wrap.n;
}
