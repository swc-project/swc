import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @strict: true
// @outDir: out
// @declaration: true
// @filename: main.js
var K = require("./mod1").K;
/** @param {K} k */ function f(k) {
    k.values();
}
// @filename: mod1.js
exports.K = /*#__PURE__*/ function() {
    "use strict";
    function K1() {
        swcHelpers.classCallCheck(this, K1);
    }
    var _proto = K1.prototype;
    _proto.values = function values() {};
    return K1;
}();
