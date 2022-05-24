import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: npmlog.js
var EE = /*#__PURE__*/ function() {
    "use strict";
    function EE() {
        _class_call_check(this, EE);
    }
    var _proto = EE.prototype;
    /** @param {string} s */ _proto.on = function on(s) {};
    return EE;
}();
var npmlog = module.exports = new EE();
npmlog.on("hi") // both references should see EE.on
;
module.exports.on("hi") // here too
;
npmlog.x = 1;
module.exports.y = 2;
npmlog.y;
module.exports.x;
// @Filename: use.js
var npmlog = require("./npmlog");
npmlog.x;
npmlog.on;
