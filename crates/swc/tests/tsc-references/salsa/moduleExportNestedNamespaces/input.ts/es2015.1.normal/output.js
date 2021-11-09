// @Filename: use.js
import * as s from './mod';
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: mod.js
module.exports.n = {
};
module.exports.n.K = function C() {
    this.x = 10;
};
module.exports.Classic = class _class {
    constructor(){
        this.p = 1;
    }
};
var k = new s.n.K();
k.x;
var classic1 = new s.Classic();
/** @param {s.n.K} c
    @param {s.Classic} classic */ function f(c, classic) {
    c.x;
    classic.p;
}
