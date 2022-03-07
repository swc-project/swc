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
var K = // @filename: mod1.js
/*#__PURE__*/ function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
    }
    var _proto = K.prototype;
    _proto.values = function values() {
        return new K();
    };
    return K;
}();
exports.K = K;
