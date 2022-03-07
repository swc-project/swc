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
var NS = {};
NS.K = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    var _proto = _class.prototype;
    _proto.values = function values() {
        return new NS.K();
    };
    return _class;
})();
exports.K = NS.K;
