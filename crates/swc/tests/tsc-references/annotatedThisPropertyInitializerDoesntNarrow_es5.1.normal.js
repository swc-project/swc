import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: Compilation.js
// from webpack/lib/Compilation.js and filed at #26427
/** @param {{ [s: string]: number }} map */ function mappy(map) {}
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        /** @type {{ [assetName: string]: number}} */ this.assets = {};
    }
    var _proto = C.prototype;
    _proto.m = function m() {
        mappy(this.assets);
    };
    return C;
}();
