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
module.exports = function _class(p) {
    "use strict";
    _classCallCheck(this, _class);
    this.t = 12 + p;
};
module.exports.Sub = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.instance = new module.exports(10);
};
