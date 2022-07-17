// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: types.d.ts
// @Filename: semver.js
/// <reference path='./types.d.ts'/>
exports = module.exports = C;
C.f = function(n) {
    return n + 1;
};
function C() {
    this.p = 1;
}
// @filename: index.js
/// <reference path='./types.d.ts'/>
var C = require("./semver");
var two = C.f(1);
