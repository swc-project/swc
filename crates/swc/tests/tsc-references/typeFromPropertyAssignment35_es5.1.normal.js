import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: bug26877.js
/** @param {Emu.D} x */ function ollKorrect(x) {
    x._model;
    var y = new Emu.D();
    var z = Emu.D._wrapperInstance;
}
Emu.D = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this._model = 1;
};
// @Filename: second.js
var Emu = {};
/** @type {string} */ Emu.D._wrapperInstance;
