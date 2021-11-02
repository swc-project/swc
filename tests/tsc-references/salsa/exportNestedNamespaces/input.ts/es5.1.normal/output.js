// @Filename: use.js
import * as s from './mod';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: mod.js
exports.n = {
};
exports.n.K = function() {
    this.x = 10;
};
exports.Classic = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.p = 1;
};
var k = new s.n.K();
k.x;
var classic1 = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic) {
    c.x;
    classic.p;
}
