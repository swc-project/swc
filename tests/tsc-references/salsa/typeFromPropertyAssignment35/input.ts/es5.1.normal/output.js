function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
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
    _classCallCheck(this, _class);
    this._model = 1;
};
// @Filename: second.js
var Emu = {
};
/** @type {string} */ Emu.D._wrapperInstance;
