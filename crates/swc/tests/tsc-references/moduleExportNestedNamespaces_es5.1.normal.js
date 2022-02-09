function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: use.js
import * as s from './mod';
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: mod.js
module.exports.n = {};
module.exports.n.K = function C() {
    this.x = 10;
};
module.exports.Classic = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.p = 1;
};
var k = new s.n.K();
k.x;
var classic = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic1) {
    c.x;
    classic1.p;
}
