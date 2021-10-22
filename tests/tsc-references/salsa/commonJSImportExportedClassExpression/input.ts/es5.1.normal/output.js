function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// @allowJs: true
// @checkJs: true
// @strict: true
// @outDir: out
// @declaration: true
// @filename: main.js
var K1 = require("./mod1").K;
/** @param {K} k */ function f(k) {
    k.values();
}
// @filename: mod1.js
exports.K = /*#__PURE__*/ (function() {
    "use strict";
    function K() {
        _classCallCheck(this, K);
    }
    _createClass(K, [
        {
            key: "values",
            value: function values() {
            }
        }
    ]);
    return K;
})();
