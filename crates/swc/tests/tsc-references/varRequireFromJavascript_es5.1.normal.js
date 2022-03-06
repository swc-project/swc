import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @strict: true
// @noEmit: true
// @Filename: ex.js
export var Crunch = /*#__PURE__*/ function() {
    "use strict";
    function Crunch(n) {
        swcHelpers.classCallCheck(this, Crunch);
        this.n = n;
    }
    swcHelpers.createClass(Crunch, [
        {
            key: "m",
            value: function m() {
                return this.n;
            }
        }
    ]);
    return Crunch;
}();
// @Filename: use.js
var ex = require('./ex');
// values work
var crunch = new ex.Crunch(1);
crunch.n;
// types work
/**
 * @param {ex.Crunch} wrap
 */ function f(wrap) {
    wrap.n;
}
