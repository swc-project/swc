import * as swcHelpers from "@swc/helpers";
var EE = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: npmlog.js
/*#__PURE__*/ function() {
    "use strict";
    function EE() {
        swcHelpers.classCallCheck(this, EE);
    }
    var _proto = EE.prototype;
    /** @param {string} s */ _proto.on = function on(s) {};
    return EE;
}();
var npmlog = module.exports = new EE();
npmlog.on('hi') // both references should see EE.on
;
module.exports.on('hi') // here too
;
npmlog.x = 1;
module.exports.y = 2;
npmlog.y;
module.exports.x;
// @Filename: use.js
var npmlog = require('./npmlog');
npmlog.x;
npmlog.on;
