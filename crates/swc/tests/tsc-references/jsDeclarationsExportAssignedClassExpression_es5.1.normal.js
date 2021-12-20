function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
module.exports = function Thing(p) {
    "use strict";
    _classCallCheck(this, Thing);
    this.t = 12 + p;
};
